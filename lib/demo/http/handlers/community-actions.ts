/**
 * Everything the community lets you DO, plus the read surfaces that hang off it.
 *
 * Split from `community.ts` because that module is the seed and this one is the
 * mutation layer: replies, votes on replies, marking an answer helpful, follows,
 * tags, bounties, reports, profiles and the live rooms. The seed, the overlay
 * keys and the payload builders are imported from there so both halves read the
 * same state. A reply that does not appear in the thread it was posted to, or a
 * follow that is gone after a reload, reads as fake faster than an error does.
 *
 * Shapes are taken from the return types in `lib/services/community.service.ts`
 * rather than guessed. Two of them are easy to get wrong and worth calling out:
 * `acceptComment` returns the whole Comment (the page reads `is_accepted` and
 * `accepted_at` off the response), and `moderateRoomParticipant` returns the
 * whole RoomDetail (the page replaces its room state with the response, so a
 * bare `{ok:true}` would blank the participant list).
 */

import { defineRoutes } from "../router";
import { DemoHttpError, badRequest, forbidden, notFound } from "../types";
import { STUDENT_PERSONA, personById, type DemoPerson } from "../../db/people";
import { nextDemoId, overlay } from "../../db/overlay";
import { iso, nowMs } from "../../clock";
import { seededInt } from "../../random";
import {
  acceptedCommentIds,
  allCommentRecords,
  allTags,
  author,
  badgesFor,
  bookmarkedThreadIds,
  bountyFor,
  bountyRows,
  commentPayload,
  commentRecords,
  commentTree,
  communityXp,
  followedTagIds,
  followedUserIds,
  followerCountFor,
  handleOf,
  personByHandle,
  pollResults,
  pollVoteFor,
  roomDetailPayload,
  roomPayload,
  roomRecord,
  roomRecords,
  statsFor,
  tagsByIds,
  threadPayload,
  threadRecord,
  threadRecords,
  threadDetailPayload,
  tierOf,
  viewerOf,
  xpEvents,
  type BountyState,
  type CommentRecord,
  type PostType,
  type RoomOverride,
  type RoomRecord,
  type ThreadRecord,
  type XpEvent,
} from "./community";

const MODULE = "community-actions";

/* ----------------------------------------------------------------- helpers */

const STAFF_ROLES = ["instructor", "admin", "superadmin"];

function isStaff(person: DemoPerson): boolean {
  return STAFF_ROLES.includes(person.role);
}

/** Author or staff. Anything else gets a plain refusal, not a silent no-op. */
function assertCanEditThread(record: ThreadRecord, viewer: DemoPerson): void {
  if (record.authorId === viewer.id || isStaff(viewer)) return;
  throw forbidden("You can only edit or delete your own posts.");
}

function assertCanEditComment(record: CommentRecord, viewer: DemoPerson): void {
  if (record.authorId === viewer.id || isStaff(viewer)) return;
  throw forbidden("You can only edit or delete your own answers.");
}

function requireThread(id: number): ThreadRecord {
  const record = threadRecord(id);
  if (!record) throw notFound("Thread not found");
  return record;
}

function requireRoom(id: number): RoomRecord {
  const room = roomRecord(id);
  if (!room) throw notFound("Room not found");
  return room;
}

function findComment(threadId: number, commentId: number): CommentRecord {
  const record = commentRecords(threadId).find((c) => c.id === commentId);
  if (!record) throw notFound("Answer not found");
  return record;
}

/**
 * Record an IP award so the balance, the history and the toast agree.
 *
 * The page shows "+5 IP" optimistically the moment a reply posts. If the ledger
 * did not move with it, the next read of /xp/ would snap the number back and the
 * milestone widget would visibly lose progress the visitor just watched happen.
 */
function awardXp(entry: Omit<XpEvent, "id" | "created_at">): void {
  overlay.unshift<XpEvent>("community:xp", {
    ...entry,
    id: nextDemoId("community-xp"),
    created_at: iso(new Date(nowMs())),
  });
}

function threadRef(record: ThreadRecord): { id: number; title: string } {
  return { id: record.id, title: record.title };
}

/* ---------------------------------------------------------------- profiles */

function requirePerson(rawId: string): DemoPerson {
  const person = personById(Number(rawId));
  if (!person) throw notFound("User not found");
  return person;
}

/**
 * A community profile for anyone on the roster.
 *
 * Every author name in every thread, comment, leaderboard row and room roster
 * links here, so this has to resolve for all of `lib/demo/db/people.ts`, not
 * just the handful of people who happen to have posted. Counts are computed
 * from what the person actually wrote rather than invented, because the page
 * prints "Posts (N)" on a tab and then renders that exact list underneath it.
 */
function profilePayload(person: DemoPerson, viewer: DemoPerson) {
  const stats = statsFor(person.id);
  const isSelf = person.id === viewer.id;
  return {
    id: person.id,
    user_name: handleOf(person),
    name: person.full_name,
    profile_pic_url: person.profile_pic_url,
    role: person.role,
    is_self: isSelf,
    is_followed_by_me: !isSelf && followedUserIds().includes(person.id),
    follower_count: followerCountFor(person),
    following_count: isSelf
      ? followedUserIds().length
      : seededInt(`following-count:${person.id}`, 4, 90),
    xp: tierOf(communityXp(person)),
    stats: {
      threads: stats.threads,
      comments: stats.comments,
      upvotes_received: stats.upvotes_received,
      accepted_answers: stats.accepted_answers,
      bounties_won: stats.bounties_won,
    },
  };
}

/* ------------------------------------------------------------------- rooms */

function nextRoomId(): number {
  return nextDemoId("community-room");
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "room"
  );
}

/**
 * Merge, do not replace: `moderated` accumulates.
 *
 * A host who kicks one person and then bans another must end up with both
 * decisions applied. Spreading the patch over the stored override would have
 * dropped the first one, which reads as the button not working.
 */
function patchRoom(roomId: number, patch: RoomOverride): void {
  overlay.update<Record<string, RoomOverride>>("community:roomState", {}, (current) => {
    const previous = current[String(roomId)] ?? {};
    return {
      ...current,
      [String(roomId)]: {
        ...previous,
        ...patch,
        moderated: { ...(previous.moderated ?? {}), ...(patch.moderated ?? {}) },
      },
    };
  });
}

function assertRoomModerator(room: RoomRecord, viewer: DemoPerson): void {
  if (room.hostId === viewer.id || isStaff(viewer)) return;
  throw forbidden("Only the host can manage this room.");
}

/* ------------------------------------------------------------------ routes */

defineRoutes(MODULE, {
  /* --- threads -------------------------------------------------------- */

  /**
   * The list call builds its URL as `/threads/${queryString}`, which reads as an
   * extra path segment to anything comparing call sites with routes. Pointing it
   * at the detail payload keeps that comparison honest and costs nothing: the
   * only path that can actually reach a six-segment /threads/<x> is a thread id.
   */
  "GET /community-forum/api/clients/:clientId/threads/:threadId": (req) =>
    threadDetailPayload(Number(req.params.threadId), viewerOf(req)),

  "PUT /community-forum/api/clients/:clientId/threads/:threadId/": (req) => {
    const viewer = viewerOf(req);
    const record = requireThread(Number(req.params.threadId));
    assertCanEditThread(record, viewer);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const patch: Partial<ThreadRecord> = {
      updatedAt: iso(new Date(nowMs())),
    };
    if (typeof body.title === "string") patch.title = body.title;
    if (typeof body.body === "string") patch.body = body.body;
    if (Array.isArray(body.tag_ids)) patch.tagIds = body.tag_ids as number[];
    if (typeof body.post_type === "string") patch.postType = body.post_type as PostType;
    if (Array.isArray(body.image_urls)) patch.imageUrls = body.image_urls as string[];

    overlay.update<Record<string, Partial<ThreadRecord>>>(
      "community:threadEdits",
      {},
      (current) => ({
        ...current,
        [String(record.id)]: { ...(current[String(record.id)] ?? {}), ...patch },
      }),
    );
    return threadPayload(requireThread(record.id), viewer);
  },

  "DELETE /community-forum/api/clients/:clientId/threads/:threadId/": (req) => {
    const viewer = viewerOf(req);
    const record = requireThread(Number(req.params.threadId));
    assertCanEditThread(record, viewer);
    overlay.update<number[]>("community:deletedThreads", [], (list) =>
      list.includes(record.id) ? list : [...list, record.id],
    );
    return {};
  },

  /** Pin and lock are toggles: the page renders whichever state comes back. */
  "POST /community-forum/api/clients/:clientId/threads/:threadId/pin/": (req) => {
    const record = requireThread(Number(req.params.threadId));
    if (!isStaff(viewerOf(req))) throw forbidden("Only instructors and admins can pin a post.");
    const next = !record.pinned;
    overlay.update<Record<string, boolean>>("community:pinned", {}, (current) => ({
      ...current,
      [String(record.id)]: next,
    }));
    return { is_pinned: next };
  },

  "POST /community-forum/api/clients/:clientId/threads/:threadId/lock/": (req) => {
    const record = requireThread(Number(req.params.threadId));
    if (!isStaff(viewerOf(req))) throw forbidden("Only instructors and admins can lock a post.");
    const next = !record.locked;
    overlay.update<Record<string, boolean>>("community:locked", {}, (current) => ({
      ...current,
      [String(record.id)]: next,
    }));
    return { is_locked: next };
  },

  "POST /community-forum/api/clients/:clientId/threads/:threadId/report/": (req) => {
    const record = requireThread(Number(req.params.threadId));
    const body = (req.body ?? {}) as Record<string, unknown>;
    overlay.unshift("community:reports", {
      id: nextDemoId("community-report"),
      target: "thread",
      thread_id: record.id,
      comment_id: null,
      reason: String(body.reason ?? "other"),
      details: String(body.details ?? ""),
      reported_by: viewerOf(req).id,
      created_at: iso(new Date(nowMs())),
    });
    return {};
  },

  /**
   * Poll votes. The response replaces the optimistic tallies on the card, so it
   * has to carry both the new counts and which option is now mine, including
   * `null` when the click removed a vote.
   */
  "POST /community-forum/api/clients/:clientId/threads/:threadId/poll-vote/": (req) => {
    const record = requireThread(Number(req.params.threadId));
    if (!record.pollOptions) throw badRequest({ detail: "This post is not a poll." });
    const index = Number((req.body ?? {}).option_index ?? 0);
    if (!Number.isInteger(index) || index < 0 || index >= record.pollOptions.length) {
      throw badRequest({ detail: "That option is not on this poll." });
    }
    const previous = pollVoteFor(record.id);
    overlay.update<Record<string, number>>("community:pollVotes", {}, (current) => {
      const next = { ...current };
      if (previous === index) delete next[String(record.id)];
      else next[String(record.id)] = index;
      return next;
    });
    if (previous === null) {
      awardXp({
        source: "poll_vote",
        source_label: "Voted in a poll",
        amount: 1,
        description: `Voted in "${record.title}"`,
        thread: threadRef(record),
        comment_id: null,
      });
    }
    return {
      user_poll_vote: pollVoteFor(record.id),
      poll_results: pollResults(requireThread(record.id)),
    };
  },

  /* --- comments ------------------------------------------------------- */

  "GET /community-forum/api/clients/:clientId/threads/:threadId/comments/": (req) => {
    const id = Number(req.params.threadId);
    requireThread(id);
    return commentTree(id, viewerOf(req));
  },

  /**
   * Post a reply.
   *
   * `parent_id` is what turns this into a nested reply rather than a new
   * top-level answer, and the thread page re-reads the whole thread straight
   * afterwards, so the record has to be in the overlay before this returns.
   */
  "POST /community-forum/api/clients/:clientId/threads/:threadId/comments/": (req) => {
    const viewer = viewerOf(req);
    const record = requireThread(Number(req.params.threadId));
    if (record.locked) {
      throw badRequest({ detail: "This thread is locked, so it is not taking new replies." });
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    const text = String(body.body ?? "").trim();
    if (!text) throw badRequest({ detail: "Write something before posting." });

    const parentId = body.parent_id === undefined || body.parent_id === null
      ? null
      : Number(body.parent_id);
    const now = iso(new Date(nowMs()));
    const comment: CommentRecord = {
      id: nextDemoId("community-comment"),
      threadId: record.id,
      authorId: viewer.id,
      body: text,
      baseUpvotes: 0,
      createdAt: now,
      updatedAt: now,
      parentId,
    };
    overlay.update<Record<string, CommentRecord[]>>("community:comments", {}, (current) => ({
      ...current,
      [String(record.id)]: [...(current[String(record.id)] ?? []), comment],
    }));
    awardXp({
      source: "comment",
      source_label: parentId === null ? "Answered a question" : "Replied to an answer",
      amount: 5,
      description: `Replied on "${record.title}"`,
      thread: threadRef(record),
      comment_id: comment.id,
    });
    return commentPayload(comment, viewer);
  },

  "PUT /community-forum/api/clients/:clientId/threads/:threadId/comments/:commentId/": (req) => {
    const viewer = viewerOf(req);
    const threadId = Number(req.params.threadId);
    requireThread(threadId);
    const comment = findComment(threadId, Number(req.params.commentId));
    assertCanEditComment(comment, viewer);
    const text = String((req.body ?? {}).body ?? "").trim();
    if (!text) throw badRequest({ detail: "An answer cannot be empty." });
    const updatedAt = iso(new Date(nowMs()));
    overlay.update<Record<string, { body: string; updatedAt: string }>>(
      "community:commentEdits",
      {},
      (current) => ({ ...current, [String(comment.id)]: { body: text, updatedAt } }),
    );
    return commentPayload({ ...comment, body: text, updatedAt }, viewer);
  },

  "DELETE /community-forum/api/clients/:clientId/threads/:threadId/comments/:commentId/": (req) => {
    const viewer = viewerOf(req);
    const threadId = Number(req.params.threadId);
    requireThread(threadId);
    const comment = findComment(threadId, Number(req.params.commentId));
    assertCanEditComment(comment, viewer);
    overlay.update<number[]>("community:deletedComments", [], (list) =>
      list.includes(comment.id) ? list : [...list, comment.id],
    );
    return {};
  },

  "POST /community-forum/api/clients/:clientId/threads/:threadId/comments/:commentId/vote/": (req) => {
    const threadId = Number(req.params.threadId);
    requireThread(threadId);
    const comment = findComment(threadId, Number(req.params.commentId));
    const voteType = String((req.body ?? {}).vote_type ?? "upvote");
    overlay.update<Record<string, string>>("community:commentVotes", {}, (current) => {
      const next = { ...current };
      if (next[String(comment.id)] === voteType) delete next[String(comment.id)];
      else next[String(comment.id)] = voteType;
      return next;
    });
    return { id: comment.id, vote_type: voteType, message: "Vote recorded." };
  },

  /**
   * Mark an answer helpful. A toggle, and deliberately not exclusive: the thread
   * page stopped un-marking the others when the product allowed more than one
   * helpful answer per question.
   */
  "POST /community-forum/api/clients/:clientId/threads/:threadId/comments/:commentId/accept/": (req) => {
    const viewer = viewerOf(req);
    const threadId = Number(req.params.threadId);
    const record = requireThread(threadId);
    if (record.authorId !== viewer.id && !isStaff(viewer)) {
      throw forbidden("Only the person who asked, or an instructor, can mark an answer helpful.");
    }
    const comment = findComment(threadId, Number(req.params.commentId));
    const current = acceptedCommentIds(threadId);
    const nowAccepted = !current.includes(comment.id);
    const next = nowAccepted
      ? [...current, comment.id]
      : current.filter((id) => id !== comment.id);
    overlay.update<Record<string, number[]>>("community:accepted", {}, (map) => ({
      ...map,
      [String(threadId)]: next,
    }));
    if (nowAccepted) {
      awardXp({
        source: "accepted",
        source_label: "Marked an answer helpful",
        amount: 5,
        description: `Marked an answer helpful on "${record.title}"`,
        thread: threadRef(record),
        comment_id: comment.id,
      });
    }
    return commentPayload(comment, viewer);
  },

  "POST /community-forum/api/clients/:clientId/threads/:threadId/comments/:commentId/report/": (req) => {
    const threadId = Number(req.params.threadId);
    requireThread(threadId);
    const comment = findComment(threadId, Number(req.params.commentId));
    const body = (req.body ?? {}) as Record<string, unknown>;
    overlay.unshift("community:reports", {
      id: nextDemoId("community-report"),
      target: "comment",
      thread_id: threadId,
      comment_id: comment.id,
      reason: String(body.reason ?? "other"),
      details: String(body.details ?? ""),
      reported_by: viewerOf(req).id,
      created_at: iso(new Date(nowMs())),
    });
    return {};
  },

  /* --- bounties ------------------------------------------------------- */

  /** Query-string shim for `/bounties/${"?status=..."}`. See the threads note. */
  "GET /community-forum/api/clients/:clientId/bounties/:status": (req) =>
    bountyRows(req.params.status || req.query.get("status")),

  "POST /community-forum/api/clients/:clientId/threads/:threadId/bounty/": (req) => {
    const record = requireThread(Number(req.params.threadId));
    const points = Number((req.body ?? {}).points ?? 0);
    if (!Number.isFinite(points) || points <= 0) {
      throw badRequest({ detail: "Enter how many points the bounty is worth." });
    }
    const existing = bountyFor(record.id);
    if (existing && existing.status === "claimed") {
      throw badRequest({ detail: "This bounty has already been paid out." });
    }
    const state: BountyState = {
      points: (existing?.points ?? 0) + points,
      status: "active",
      claimedById: null,
      claimedAt: null,
    };
    overlay.update<Record<string, BountyState>>("community:bounties", {}, (current) => ({
      ...current,
      [String(record.id)]: state,
    }));
    return { id: record.id, points: state.points, status: state.status };
  },

  "POST /community-forum/api/clients/:clientId/threads/:threadId/bounty/claim/": (req) => {
    const viewer = viewerOf(req);
    const record = requireThread(Number(req.params.threadId));
    const existing = bountyFor(record.id);
    if (!existing) throw badRequest({ detail: "There is no bounty on this post." });
    if (existing.status === "claimed") {
      throw badRequest({ detail: "This bounty has already been paid out." });
    }
    if (record.authorId !== viewer.id && !isStaff(viewer)) {
      throw forbidden("Only the person who offered the bounty can award it.");
    }
    const comment = findComment(record.id, Number((req.body ?? {}).comment_id ?? 0));
    const claimed: BountyState = {
      points: existing.points,
      status: "claimed",
      claimedById: comment.authorId,
      claimedAt: iso(new Date(nowMs())),
    };
    overlay.update<Record<string, BountyState>>("community:bounties", {}, (current) => ({
      ...current,
      [String(record.id)]: claimed,
    }));
    const winner = personById(comment.authorId) ?? STUDENT_PERSONA;
    const asker = personById(record.authorId) ?? STUDENT_PERSONA;
    return {
      thread_id: record.id,
      thread_title: record.title,
      author: author(asker),
      points: claimed.points,
      has_bounty: true,
      hours_unanswered: Math.max(
        1,
        Math.round((nowMs() - new Date(record.createdAt).getTime()) / 3_600_000),
      ),
      bounty_status: claimed.status,
      comment_count: commentRecords(record.id).length,
      claimed_by: {
        id: winner.id,
        name: winner.full_name,
        profile_pic_url: winner.profile_pic_url,
      },
      claimed_at: claimed.claimedAt,
    };
  },

  /* --- tags ----------------------------------------------------------- */

  "POST /community-forum/api/clients/:clientId/tags/": (req) => {
    const raw = String((req.body ?? {}).name ?? "").trim().toLowerCase();
    const name = raw.replace(/\s+/g, "-");
    if (!name) throw badRequest({ detail: "Give the tag a name." });
    const existing = allTags().find((t) => t.name === name);
    if (existing) return existing;
    const tag = { id: nextDemoId("community-tag"), name };
    overlay.push("community:tags", tag);
    return tag;
  },

  "POST /community-forum/api/clients/:clientId/tags/:tagId/follow/": (req) => {
    const id = Number(req.params.tagId);
    const current = followedTagIds();
    overlay.set("community:followedTags", current.includes(id) ? current : [...current, id]);
    return {};
  },

  "DELETE /community-forum/api/clients/:clientId/tags/:tagId/follow/": (req) => {
    const id = Number(req.params.tagId);
    overlay.set(
      "community:followedTags",
      followedTagIds().filter((t) => t !== id),
    );
    return {};
  },

  /* --- the signed-in learner ------------------------------------------ */

  "GET /community-forum/api/clients/:clientId/user/bookmarks/": (req) => {
    const viewer = viewerOf(req);
    const saved = bookmarkedThreadIds();
    return threadRecords()
      .filter((t) => saved.includes(t.id))
      .map((t) => threadPayload(t, viewer));
  },

  "GET /community-forum/api/clients/:clientId/user/following/": (req) => {
    const viewer = viewerOf(req);
    return followedUserIds()
      .map((id) => personById(id))
      .filter((p): p is DemoPerson => Boolean(p))
      .map((person, i) => ({
        id: 8000 + i,
        follower: author(viewer),
        following: author(person),
        created_at: iso(new Date(nowMs() - (i + 1) * 86_400_000)),
      }));
  },

  "GET /community-forum/api/clients/:clientId/user/followed-tags/": () => {
    const followed = followedTagIds();
    return tagsByIds(followed).map((tag, i) => ({
      id: 8500 + i,
      tag,
      created_at: iso(new Date(nowMs() - (i + 2) * 86_400_000)),
    }));
  },

  "GET /community-forum/api/clients/:clientId/user/xp-history/": () => xpEvents(),

  /* --- other people ---------------------------------------------------- */

  /**
   * Registered before the numeric lookup on purpose. Both patterns are the same
   * length, so an @mention landing on /community/u/<handle> would otherwise be a
   * coin flip between this and `/users/:userId/comments/`.
   */
  "GET /community-forum/api/clients/:clientId/users/by-username/:username/": (req) => {
    const person = personByHandle(req.params.username);
    if (!person) throw notFound("User not found");
    return profilePayload(person, viewerOf(req));
  },

  "GET /community-forum/api/clients/:clientId/users/:userId/": (req) =>
    profilePayload(requirePerson(req.params.userId), viewerOf(req)),

  "GET /community-forum/api/clients/:clientId/users/:userId/threads/": (req) => {
    const viewer = viewerOf(req);
    const person = requirePerson(req.params.userId);
    return threadRecords()
      .filter((t) => t.authorId === person.id)
      .map((t) => threadPayload(t, viewer));
  },

  /**
   * The profile's Comments tab. Each row carries the thread it belongs to
   * because the card is a link back into the discussion, and a row whose
   * `thread` is missing would render a clickable card that goes nowhere.
   */
  "GET /community-forum/api/clients/:clientId/users/:userId/comments/": (req) => {
    const person = requirePerson(req.params.userId);
    const votes = overlay.get<Record<string, string>>("community:commentVotes", {});
    return allCommentRecords()
      .filter((c) => c.authorId === person.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((c) => {
        const parent = threadRecord(c.threadId);
        const vote = votes[String(c.id)];
        return {
          id: c.id,
          body: c.body,
          created_at: c.createdAt,
          updated_at: c.updatedAt,
          is_accepted: acceptedCommentIds(c.threadId).includes(c.id),
          thread: { id: c.threadId, title: parent?.title ?? "Discussion" },
          upvotes: c.baseUpvotes + (vote === "upvote" ? 1 : 0),
          downvotes: vote === "downvote" ? 1 : 0,
        };
      });
  },

  "POST /community-forum/api/clients/:clientId/users/:userId/follow/": (req) => {
    const person = requirePerson(req.params.userId);
    if (person.id === viewerOf(req).id) {
      throw badRequest({ detail: "You cannot follow yourself." });
    }
    const current = followedUserIds();
    overlay.set("community:following", current.includes(person.id) ? current : [...current, person.id]);
    return {};
  },

  "DELETE /community-forum/api/clients/:clientId/users/:userId/follow/": (req) => {
    const person = requirePerson(req.params.userId);
    overlay.set(
      "community:following",
      followedUserIds().filter((id) => id !== person.id),
    );
    return {};
  },

  /** Query-string shim for `/badges/${"?user_id=..."}`. See the threads note. */
  "GET /community-forum/api/clients/:clientId/badges/:userId": (req) =>
    badgesFor(Number(req.params.userId) || viewerOf(req).id),

  /* --- rooms ----------------------------------------------------------- */

  "GET /community-forum/api/clients/:clientId/rooms/active/": (req) => {
    const viewer = viewerOf(req);
    return roomRecords()
      .filter((r) => r.status === "live")
      .map((r) => roomPayload(r, viewer));
  },

  /** Both spellings resolve to the detail payload. See the threads note. */
  "GET /community-forum/api/clients/:clientId/rooms/:roomId": (req) =>
    roomDetailPayload(requireRoom(Number(req.params.roomId)), viewerOf(req)),

  "GET /community-forum/api/clients/:clientId/rooms/:roomId/": (req) =>
    roomDetailPayload(requireRoom(Number(req.params.roomId)), viewerOf(req)),

  "POST /community-forum/api/clients/:clientId/rooms/": (req) => {
    const viewer = viewerOf(req);
    if (!isStaff(viewer)) throw forbidden("Only instructors and admins can open a room.");
    const body = (req.body ?? {}) as Record<string, unknown>;
    const title = String(body.title ?? "").trim();
    if (!title) throw badRequest({ detail: "Give the room a title." });
    const startNow = body.start_now !== false;
    const now = iso(new Date(nowMs()));
    const room: RoomRecord = {
      id: nextRoomId(),
      title,
      description: String(body.description ?? ""),
      hostId: viewer.id,
      slug: slugify(title),
      status: startNow ? "live" : "scheduled",
      maxParticipants: Number(body.max_participants ?? 20) || 20,
      audioOnly: Boolean(body.is_audio_only),
      scheduledFor: typeof body.scheduled_for === "string" ? body.scheduled_for : null,
      startedAt: startNow ? now : null,
      endedAt: null,
      createdAt: now,
      participants: [
        {
          userId: viewer.id,
          role: "moderator",
          joinedAt: now,
          leftAt: null,
          lastActiveAt: now,
          active: startNow,
        },
      ],
    };
    overlay.unshift("community:rooms", room);
    return roomDetailPayload(room, viewer);
  },

  "POST /community-forum/api/clients/:clientId/rooms/:roomId/start/": (req) => {
    const viewer = viewerOf(req);
    const room = requireRoom(Number(req.params.roomId));
    assertRoomModerator(room, viewer);
    if (room.status === "ended") throw badRequest({ detail: "This room has already ended." });
    patchRoom(room.id, { status: "live", startedAt: iso(new Date(nowMs())), endedAt: null });
    return roomDetailPayload(requireRoom(room.id), viewer);
  },

  "POST /community-forum/api/clients/:clientId/rooms/:roomId/end/": (req) => {
    const viewer = viewerOf(req);
    const room = requireRoom(Number(req.params.roomId));
    assertRoomModerator(room, viewer);
    patchRoom(room.id, { status: "ended", endedAt: iso(new Date(nowMs())) });
    return roomDetailPayload(requireRoom(room.id), viewer);
  },

  /**
   * Joining is the one thing in this module that cannot be faked.
   *
   * A room is two-way audio and video: it needs a signalling server and another
   * human on the other end, and this prototype makes no network calls at all.
   * The alternative was to answer with an empty media URL, which drops the
   * visitor into the "this room was never provisioned" error pane and reads as a
   * broken build. A plain sentence about the boundary is the honest version, and
   * the lobby, the roster and the moderator controls behind it all still work.
   */
  "POST /community-forum/api/clients/:clientId/rooms/:roomId/join/": (req) => {
    const room = requireRoom(Number(req.params.roomId));
    if (room.status !== "live") throw badRequest({ detail: "This room is not live yet." });
    throw badRequest({
      detail:
        "Live audio and video are outside this preview, which runs entirely in your browser. " +
        "Everything else about the room is real: the roster, the schedule and the host controls.",
    });
  },

  "POST /community-forum/api/clients/:clientId/rooms/:roomId/leave/": (req) => {
    const viewer = viewerOf(req);
    const room = requireRoom(Number(req.params.roomId));
    patchRoom(room.id, { moderated: { [String(viewer.id)]: "inactive" } });
    return {};
  },

  /** Kick, ban and unban. Returns the whole room: the page swaps its state for it. */
  "POST /community-forum/api/clients/:clientId/rooms/:roomId/participants/:userId/": (req) => {
    const viewer = viewerOf(req);
    const room = requireRoom(Number(req.params.roomId));
    assertRoomModerator(room, viewer);
    const target = requirePerson(req.params.userId);
    if (target.id === room.hostId) throw badRequest({ detail: "The host cannot be removed." });
    const action = String((req.body ?? {}).action ?? "kick");
    const mapped =
      action === "ban" ? "banned" : action === "unban" ? "cleared" : ("inactive" as const);
    patchRoom(room.id, { moderated: { [String(target.id)]: mapped } });
    return roomDetailPayload(requireRoom(room.id), viewer);
  },

  "DELETE /community-forum/api/clients/:clientId/rooms/:roomId/": (req) => {
    const viewer = viewerOf(req);
    const room = requireRoom(Number(req.params.roomId));
    assertRoomModerator(room, viewer);
    overlay.update<number[]>("community:deletedRooms", [], (list) =>
      list.includes(room.id) ? list : [...list, room.id],
    );
    return {};
  },

  /* --- guided tour narration ------------------------------------------- */

  /**
   * The tour asks a server-side voice service for an MP3 of each step.
   *
   * There is no server here, so this answers 503, which is exactly what the
   * real deployment returns when no voice key is configured. The tour catches
   * that and narrates with the browser's own speech synthesis, so the visitor
   * still hears the walkthrough and nothing on screen fails.
   */
  "POST /community-forum/api/clients/:clientId/tour/tts/": () => {
    throw new DemoHttpError(503, {
      detail: "Voice narration is not configured, using the browser voice instead.",
    });
  },
});
