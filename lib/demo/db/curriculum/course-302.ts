/**
 * Course 302: TGPSC Group-II & Group-III Foundation.
 *
 * Assembled from the per-module parts in ./parts/. The course is authored in
 * parallel, a few topics at a time, because one author writing twenty-odd topics
 * at four reading tiers each runs out of room partway and leaves the middle of
 * the course silently falling back to the generated outline. Splitting the work
 * makes each unit finishable, and makes an unfinished one visible to
 * scripts/verify-catalogue.mjs, which fails a course that authors only part of
 * its topics.
 *
 * Part numbers are not contiguous. Gaps left by interrupted runs were filled by
 * later-numbered parts rather than by renumbering, because a topic id is a
 * contract and moving one would orphan the lesson behind it.
 *
 * They are merged here rather than loaded separately so the lazy per-course
 * chunk stays exactly one import for the loader in ./index.ts.
 */

import type { CourseCurriculum } from "./types";
import part1 from "./parts/course-302-part-1";
import part2 from "./parts/course-302-part-2";
import part3 from "./parts/course-302-part-3";
import part4 from "./parts/course-302-part-4";
import part5 from "./parts/course-302-part-5";
import part6 from "./parts/course-302-part-6";
import part7 from "./parts/course-302-part-7";

const CURRICULUM: CourseCurriculum = {
  ...part1,
  ...part2,
  ...part3,
  ...part4,
  ...part5,
  ...part6,
  ...part7,
};

export default CURRICULUM;
