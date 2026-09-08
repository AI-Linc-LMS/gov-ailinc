/**
 * Course 311: Solar PV Installer & Rooftop Technician.
 *
 * Assembled from the per-module parts in ./parts/. The course is authored in
 * parallel, a few topics at a time, because one author writing twenty-odd topics
 * at four reading tiers each runs out of room partway and leaves the middle of
 * the course silently falling back to the generated outline. Splitting the work
 * makes each unit finishable, and makes an unfinished one visible to
 * scripts/verify-catalogue.mjs, which fails a course that authors only part of
 * its topics.
 *
 * Part numbers are not always contiguous: gaps left by an interrupted run were
 * filled by later-numbered parts rather than by renumbering, because a topic id
 * is a contract and moving one would orphan the lesson behind it.
 *
 * They are merged here rather than loaded separately so the lazy per-course
 * chunk stays exactly one import for the loader in ./index.ts.
 */

import type { CourseCurriculum } from "./types";
import part1 from "./parts/course-311-part-1";
import part2 from "./parts/course-311-part-2";
import part3 from "./parts/course-311-part-3";
import part4 from "./parts/course-311-part-4";

const CURRICULUM: CourseCurriculum = {
  ...part1,
  ...part2,
  ...part3,
  ...part4,
};

export default CURRICULUM;
