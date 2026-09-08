/**
 * Course 204: Cloud Engineering with AWS.
 *
 * The promise on the card is "take an application you have written and make it
 * survive contact with production". So every topic here is written from the
 * position of an engineer who can already build the thing and now has to run it:
 * what the platform actually does underneath, which lever moves which number,
 * and what breaks at three in the morning.
 *
 * The two coding problems are executed in the browser, so they model the subject
 * rather than invoke it. A Dockerfile problem computes cache invalidation from
 * the same rules BuildKit uses; a Terraform problem walks the dependency graph
 * and diffs desired state against recorded state. The learner writes the
 * mechanism, not a string that gets compared to an answer key.
 */

import type { CourseCurriculum } from "./types";

const CURRICULUM: CourseCurriculum = {
  5052: {
    topicId: 5052,
    title: "Namespaces, layers and image size",
    summary:
      "Explain what a container actually is at the kernel level, read an image as the stack of filesystem diffs it really is, and cut image size by changing where files enter the stack rather than deleting them later.",
    concepts: [
      "Kernel namespaces",
      "Control groups",
      "Union filesystem layers",
      "Copy-on-write",
      "Content-addressable digests",
      "Layer ordering and image size",
    ],
    glossary: {
      Namespace:
        "A kernel feature that gives a process a private view of one global resource, such as the process table, the network stack or the mount table.",
      "Control group":
        "Usually written cgroup. The kernel mechanism that caps and accounts for the CPU, memory and IO that a group of processes may consume.",
      Layer:
        "An immutable filesystem diff produced by one build instruction, stored and named by the hash of its own contents.",
      "Union filesystem":
        "A driver such as overlay2 that stacks several read-only directories plus one writable directory and presents them as a single merged tree.",
      "Copy-on-write":
        "The rule that a file from a lower layer is duplicated into the writable layer only at the instant something modifies it.",
      Digest:
        "A SHA-256 hash naming a layer or a manifest, so two images that contain the same layer store it once and pull it once.",
      "Whiteout file":
        "A marker written by an upper layer to hide a path that exists in a lower layer, which is why deleting a file does not shrink an image.",
      "Base image":
        "The image named in FROM, whose layers every image built on top of it inherits unchanged.",
    },
    body: {
      Beginner: `
<p>A container feels like a small computer running inside your computer. It is not. It is one
ordinary process on the host machine, wearing a blindfold. The kernel simply lies to it about
what exists.</p>

<h2>The blindfold has a name</h2>
<p>The lie is assembled from <strong>namespaces</strong>. A namespace takes one global thing, the
list of running processes for instance, and hands the container its own private view of it.
Inside the container your application is process number one and can see nothing else. Outside on
the host it is process 48213, sitting in the list next to your text editor.</p>
<ul>
<li>The <em>PID</em> namespace hides every other process on the machine.</li>
<li>The <em>network</em> namespace gives the container its own network interface and its own set
of port numbers, which is why two containers can both happily listen on port 8080.</li>
<li>The <em>mount</em> namespace gives it its own idea of what the filesystem contains.</li>
</ul>
<p>A separate kernel feature called <strong>control groups</strong> does the other half of the job.
Namespaces decide what a process can see. Control groups decide how much memory and CPU it is
allowed to use, and stop it when it reaches the limit.</p>

<h2>Why an image is a stack</h2>
<p>An image is not one large folder. It is a stack of thin sheets, like tracing paper. Each
instruction in the build adds one sheet, and that sheet records only what changed: files added,
files edited, files removed. Look down through the stack from the top and you see the finished
filesystem.</p>
<p>This has a consequence that surprises almost everybody the first time. Deleting a file in a
later sheet does not remove it from the image. The earlier sheet still contains it, and the later
sheet only paints over the top. The bytes are still downloaded, still stored, and still counted in
the size you are billed for.</p>

<aside class="tip"><p>If you want a file gone, it must never be added in a sheet below the one that
deletes it. Add it and remove it inside a single instruction, or do not add it at all.</p></aside>

<p>So the first size lesson is not about compression. It is about geography: which layer a file
enters the stack in, and whether anything below it ever needed that file.</p>
`,
      Intermediate: `
<p>A container is a process with three kernel features wrapped around it: namespaces for isolation,
cgroups for resource limits, and a union filesystem for its root directory. Nothing is virtualised.
There is one kernel, and <code>ps aux</code> on the host shows your container's processes sitting in
the same table as everything else.</p>

<h2>Namespaces and cgroups</h2>
<p>Each namespace type virtualises exactly one global resource. The set you will meet in practice is
PID, network, mount, UTS (the hostname), IPC and user. A container is simply a process started with
a fresh set of these. That is why <code>docker exec</code> is fast: it is not booting anything, it is
joining an existing set of namespaces with <code>setns</code>.</p>
<p>cgroups v2 handles the accounting. When a container is killed with exit code 137, the kernel OOM
killer acted inside the memory cgroup, not the host at large. Reading
<code>memory.max</code> and <code>memory.current</code> for that cgroup tells you exactly how close
you were, which is far more useful than guessing from the crash.</p>

<h2>overlay2, in one paragraph</h2>
<p>The default storage driver stacks a series of read-only <em>lower</em> directories under a single
writable <em>upper</em> directory and presents the union as the container root. Reads walk down the
stack and stop at the first hit. Writes go to the upper directory, and a file that lives in a lower
layer is copied up whole before the first byte is modified. That copy-up cost is why writing to a
large file inside a container can stall on the first write and then run at full speed afterwards.</p>
<p>Deletion is where size intuitions break. Removing a path that exists in a lower layer cannot
delete it, because lower layers are immutable and shared. Instead overlay2 writes a
<strong>whiteout</strong>, a character device with major and minor zero, which masks the path from
the merged view. The original bytes stay in the layer, and the whiteout adds a few bytes of its own.</p>

<h2>What actually moves image size</h2>
<ul>
<li><strong>Merge the add and the remove.</strong> Downloading a tarball, extracting it and deleting
the tarball in three separate RUN instructions ships the tarball. Doing all three inside one RUN
ships only the extracted result.</li>
<li><strong>Choose the base deliberately.</strong> The base image is usually the largest single
contribution. A slim or distroless base can remove hundreds of megabytes before you have written a
line of your own.</li>
<li><strong>Stop shipping build tooling.</strong> Compilers, headers and package caches belong in a
build stage, not in the image that runs in production.</li>
<li><strong>Delete package manager caches in the same instruction that populated them.</strong></li>
</ul>

<h2>Digests make sharing free</h2>
<p>Every layer is named by the SHA-256 of its contents, so identity is decided by the bytes rather
than by the tag that happened to point at them. If forty of your services derive from the same base
image, the registry stores that base once and each host pulls it once. This is the strongest
practical argument for standardising on a small number of base images: it turns image size from a
per-service cost into a shared, already-cached one.</p>

<aside class="tip"><p>Total image size is the wrong number to optimise on its own. The number that
affects a deploy is the size of the layers a host does <em>not</em> already have, which is why a
900 MB image on a shared base can deploy faster than a 200 MB image nobody else uses.</p></aside>
`,
      Advanced: `
<p>Once the model is familiar, the interesting questions are the ones about behaviour under load and
at the edges: how many layers is too many, when copy-up hurts, why the same image behaves differently
under a different storage driver, and what happens to page cache when a hundred containers share a
base.</p>

<h2>Layer count is not free</h2>
<p>Every additional lower directory adds a level that the union filesystem must walk on a cache miss,
and the mount option string grows with it. Historic drivers had hard ceilings; overlay2 has no small
fixed limit, but path lookup cost, mount option length and manifest size all grow linearly. In
practice the cost that bites first is not lookup, it is the pull: many small layers mean many
round trips, and registries are latency-bound long before they are bandwidth-bound. Aim for layers
that are meaningful cache boundaries rather than as few or as many as possible.</p>

<h2>Copy-up and the write-heavy container</h2>
<p>Copy-on-write is per file, not per block. Modifying one byte of a 4 GB file in a lower layer copies
all 4 GB into the upper directory first, consuming both time and the container's writable space.
Databases, search indexes and anything that rewrites large files in place should therefore never run
against the union filesystem. Mount a volume, which bypasses the union entirely and hands the process
a real filesystem path.</p>

<h2>Page cache is shared, and that is the point</h2>
<p>Because lower layers are ordinary files on the host, the page cache holding a shared base image is
shared across every container using it. A hundred containers on one common base do not consume a
hundred copies of libc in memory. This inverts a common instinct: consolidating onto one slightly
larger shared base often reduces total host memory compared with fifty individually minimal bases
that share nothing.</p>

<h2>Failure modes worth recognising</h2>
<ul>
<li><strong>Squash destroys cache reuse.</strong> Flattening to a single layer makes the image smaller
on paper and makes every deploy a full transfer, because no host will ever already hold the one layer
that is now the whole image.</li>
<li><strong>Rootless containers use a user namespace</strong>, so UIDs inside are mapped to a
subordinate range outside. Files written to a bind mount appear owned by an unexpected high UID, and
a build that hardcodes UID 1000 in file ownership breaks on some hosts and not others.</li>
<li><strong>Alpine changes libc.</strong> musl rather than glibc changes DNS resolution behaviour,
thread stack defaults and the availability of prebuilt wheels or native modules. The size saving is
real, and so is the class of bug it introduces.</li>
<li><strong>Timestamps defeat caching.</strong> Any instruction that embeds the current time or a
build number into an early layer invalidates everything below it on every build.</li>
</ul>

<aside class="tip"><p>Before optimising, measure per layer rather than in total. Walking the image
manifest and attributing bytes to the instruction that produced them almost always finds one
accidental layer, typically a package cache or a copied source tree, holding most of the weight.</p></aside>
`,
      Expert: `
<p>The container image is a specification, not a Docker feature, and reading the specification
resolves most of the arguments people have about it. An OCI image is a manifest listing a config
blob and an ordered set of layer blobs, all addressed by digest, plus an optional index that maps
platforms to manifests.</p>

<h2>diff_id and digest are not the same hash</h2>
<p>The config blob contains <code>rootfs.diff_ids</code>, the hashes of the <em>uncompressed</em> tar
streams, in order. The manifest lists layer descriptors whose digests are the hashes of the
<em>compressed</em> blobs as stored. The chain ID, computed by folding diff_ids together, is what a
runtime uses to decide whether it already has an unpacked layer locally. Recompressing a layer, for
example moving from gzip to zstd, changes every manifest digest while leaving every diff_id
untouched. Tools that report "the image changed" after a registry migration are usually comparing
the wrong one of the two.</p>

<h2>Whiteouts in the archive format</h2>
<p>The union semantics are encoded in the tar stream itself. A deleted path appears as a zero-length
entry named <code>.wh.&lt;name&gt;</code>, and a directory whose lower contents must be hidden
entirely carries <code>.wh..wh..opq</code>. An opaque directory marker is the reason an apparently
harmless recursive copy over an existing directory can mask files you never touched, and it is
invisible to anything that inspects only the merged filesystem rather than the layer archive.</p>

<h2>Lazy pulling changes the size calculus</h2>
<p>Formats such as eStargz and zstd:chunked make layers seekable, with a table of contents that lets a
runtime start a container after fetching only the files it actually opens. Where this is supported,
image size stops being the dominant contributor to start latency and is replaced by file access
locality: an image whose first-accessed files are scattered across many chunks starts slowly even
if it is small. Optimising then means ordering content by access pattern, which is a different
exercise from minimising bytes.</p>

<h2>What the documentation tends to understate</h2>
<ul>
<li><strong>Reproducibility is not the default.</strong> Layer digests incorporate file timestamps and
ownership, so two builds of identical source produce different digests unless timestamps are
normalised. This is why content-addressed caching often misses when teams expect it to hit.</li>
<li><strong>The config blob is part of the image identity.</strong> Changing an environment variable
or a label changes the config digest and therefore the manifest digest, even though no layer bytes
moved. A deploy pipeline keyed on manifest digest will see a new image where a pipeline keyed on
diff_ids will not.</li>
<li><strong>Namespaces do not draw a security boundary on their own.</strong> The kernel is shared,
so the effective boundary is the union of user namespace mapping, seccomp profile, capability set and
mandatory access control. A hardened image with the default capability set and no seccomp profile is
weaker than a large image run with both.</li>
</ul>

<aside class="tip"><p>When an image behaves differently in two environments and the tag is identical,
compare the manifest digests before anything else. A mutable tag repointed at a rebuilt image is a
more common explanation than any runtime difference.</p></aside>
`,
    },
  },
  5053: {
    topicId: 5053,
    title: "Writing a Dockerfile that builds fast",
    summary:
      "Order a Dockerfile so that the expensive steps stay cached across ordinary code changes, shrink the build context, and split builds into stages so the image you ship contains none of the tooling that produced it.",
    concepts: [
      "Build cache invalidation",
      "Instruction ordering",
      "Multi-stage builds",
      "Build context and .dockerignore",
      "Cache mounts",
      "Deterministic dependency installs",
    ],
    glossary: {
      "Build context":
        "The directory tree the client sends to the builder before the first instruction runs. Everything in it is transferred whether or not any instruction uses it.",
      ".dockerignore":
        "A file listing paths excluded from the build context, evaluated before transfer, so excluded paths cost nothing and cannot invalidate a cache.",
      "Cache key":
        "The value a builder hashes to decide whether a layer can be reused: the parent layer plus the instruction text, and for COPY and ADD the contents of the files being copied.",
      "Multi-stage build":
        "A Dockerfile containing several FROM instructions, where later stages copy selected artefacts out of earlier ones and everything else is discarded.",
      BuildKit:
        "The modern builder, which resolves the Dockerfile into a dependency graph rather than a straight line, so unrelated stages build in parallel.",
      "Cache mount":
        "A directory mounted into a RUN step that persists between builds but is never committed into a layer, used for package manager caches.",
      "COPY --from":
        "A form of COPY that reads from a named earlier stage or another image instead of from the build context.",
      "Lockfile install":
        "Installing dependencies from a resolved lockfile rather than a range specification, so the same input always produces the same tree.",
    },
    body: {
      Beginner: `
<p>A slow build is rarely slow because your computer is slow. It is slow because it is redoing work
it already did. The builder is perfectly willing to skip steps it has done before, but only if you
arrange the file so that it can.</p>

<h2>The builder is lazy, and that is good</h2>
<p>Each instruction produces one layer. Before running an instruction the builder asks a simple
question: has this exact instruction ever run on top of this exact previous layer? If yes, it reuses
the stored result instantly. If no, it runs the instruction and, crucially, every single instruction
after it, because those all sat on top of something that has now changed.</p>
<p>So a cache miss is never local. It is a miss at that line and at every line below it. One
carelessly placed instruction near the top can make the entire build run from scratch on every code
change.</p>

<h2>The classic mistake</h2>
<pre><code>FROM node:20-alpine
COPY . .
RUN npm ci
RUN npm run build</code></pre>
<p>Change one character in one source file and <code>COPY . .</code> misses, so
<code>npm ci</code> reinstalls every dependency from nothing, every time. The dependencies did not
change. The builder has no way of knowing that, because you told it to copy everything at once.</p>

<h2>The fix</h2>
<pre><code>FROM node:20-alpine
COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
RUN npm run build</code></pre>
<p>Now editing a source file only misses at <code>COPY src ./src</code>. The install above it stays
cached, because the two files it depends on genuinely did not change. Installing dependencies is
usually the slowest step in the build, and you have just stopped paying for it.</p>

<aside class="tip"><p>Read your Dockerfile top to bottom and ask of each line: how often does the
input to this change? Put the rarely-changing things first and the frequently-changing things last.
That single ordering rule is most of the speed available.</p></aside>

<h2>Do not send what you do not need</h2>
<p>Before any instruction runs, the whole directory is packaged and sent to the builder. If that
directory contains a local <code>node_modules</code>, a <code>.git</code> history and a folder of
test videos, all of it is transferred first. A <code>.dockerignore</code> file listing those paths
removes them from the transfer entirely, which makes builds faster and stops unrelated files from
invalidating a copy.</p>
`,
      Intermediate: `
<p>Build speed is a cache design problem. You are choosing where the boundaries between layers fall,
and therefore which changes are cheap and which are expensive. Get the boundaries right and a
typical code change rebuilds two layers; get them wrong and it rebuilds twelve.</p>

<h2>What the cache key actually contains</h2>
<p>For most instructions the key is the parent layer's identity plus the literal instruction text.
For <code>COPY</code> and <code>ADD</code> it additionally includes a hash of the file contents being
copied, which is why copying a file whose bytes are unchanged is a hit even if its modification time
moved. Because the parent layer is part of the key, invalidation cascades downwards and never
upwards. Order therefore encodes a change frequency ranking, from least to most volatile.</p>

<h2>Split dependency installation from source</h2>
<p>The universal shape is: copy the dependency manifests, install, then copy the source. This works
for every ecosystem that has a manifest and a lockfile, and the win scales with how slow the install
is. Use the reproducible install command rather than the convenient one, because a resolver that is
free to pick a newer patch version produces a different tree from the same manifest and quietly
breaks the assumption the cache is built on.</p>
<ul>
<li>Node: <code>npm ci</code> rather than <code>npm install</code>.</li>
<li>Python: install from a fully pinned requirements file or a lock export.</li>
<li>Go: copy <code>go.mod</code> and <code>go.sum</code>, run <code>go mod download</code>, then copy
the packages.</li>
</ul>

<h2>Multi-stage builds</h2>
<p>A build stage exists to produce artefacts. The runtime stage exists to run them. Keeping them
separate means compilers, headers, dev dependencies and the source tree itself never reach the image
that runs in production, which shrinks it and removes most of its vulnerability surface at the same
time.</p>
<pre><code>FROM node:20 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]</code></pre>
<p>Only the stages the target actually depends on are built, and only the final stage is shipped. A
test stage placed alongside runtime will run in CI when targeted and cost the production image
nothing.</p>

<h2>Cache mounts for package managers</h2>
<p>Even a correct ordering pays full price the first time a dependency changes, because the package
manager cache lives inside the layer and is discarded. A cache mount keeps that directory outside the
layer and persistent across builds:</p>
<pre><code>RUN --mount=type=cache,target=/root/.npm npm ci</code></pre>
<p>The downloaded tarballs survive, so changing one dependency refetches one dependency instead of
all of them, and none of the cache is committed into the image.</p>

<aside class="tip"><p>In CI the local layer cache is usually empty on every run. Point the builder at
a registry-backed cache so that yesterday's layers are importable, otherwise your carefully ordered
Dockerfile is only fast on the machine that already built it.</p></aside>
`,
      Advanced: `
<p>With ordering and stages in place, the remaining build time sits in three places: context transfer,
serialised work that could have been parallel, and cache misses that are invisible until you look for
them.</p>

<h2>The graph, not the ladder</h2>
<p>BuildKit resolves a Dockerfile into a directed graph of operations and then evaluates only the
subgraph the requested target needs. Independent stages run concurrently. This changes how you write
the file: splitting a monolithic build stage into two stages that do not depend on each other turns
sequential work into parallel work for free. It also means an unreferenced stage costs nothing, so
keeping a lint stage and a test stage in the same Dockerfile is not a tax on production builds.</p>

<h2>Cache invalidation you did not intend</h2>
<ul>
<li><strong>Copying a directory to reach one file.</strong> <code>COPY . .</code> before the install
step is the canonical example, but so is copying an entire config directory when the install reads
one file from it.</li>
<li><strong>Build arguments consumed too early.</strong> An <code>ARG</code> referenced in an
instruction near the top means every build with a new commit SHA invalidates from that point down.
Push version metadata to the last possible instruction.</li>
<li><strong>Generated files inside the context.</strong> A build that writes into the working tree,
then runs again, presents different bytes to <code>COPY</code> and misses. Exclude generated paths in
<code>.dockerignore</code>.</li>
<li><strong>Unpinned base tags.</strong> <code>FROM node:20</code> resolves to whatever that tag points
at today. When it moves, every layer in every stage rebuilds, on every machine, at once.</li>
</ul>

<h2>Distributed cache and its failure modes</h2>
<p>Registry-backed cache export has two modes worth distinguishing. Inline cache attaches metadata to
the pushed image and only carries the final stage, so intermediate stages, which is where the
expensive install lives, are not importable. A dedicated cache manifest exports every stage and
imports properly, at the cost of a separate artefact to store and expire. Teams that report "remote
cache does not work for us" have usually chosen the first and needed the second.</p>

<h2>Reproducibility and cache correctness</h2>
<p>A cache is only safe if identical inputs imply identical outputs. Any instruction that reaches the
network without pinning breaks that implication: an unversioned package install, a script fetched from
a URL, a dependency range resolved at build time. The result is not a slow build, it is a build that
succeeds on one machine and fails on another with the same source, and a cache entry that is
confidently wrong. Pin versions, prefer lockfiles, and treat any RUN that fetches something unpinned
as a defect rather than a convenience.</p>

<aside class="tip"><p>Measure before rearranging. Building with a per-step timing output and reading
which steps actually ran usually shows the cost concentrated in one or two instructions, and just as
often shows a step you assumed was cached missing on every run.</p></aside>
`,
      Expert: `
<p>The Dockerfile is a front end. BuildKit lowers it to LLB, a low level build definition that is a
content-addressed DAG of vertices, each with inputs, a cache key and an output snapshot. Every
property people attribute to "the Docker cache" falls out of that representation, and the ones people
find surprising fall out of it too.</p>

<h2>Two cache keys per vertex</h2>
<p>Each vertex computes a <em>definition</em> key from its operation and the keys of its inputs, and,
after execution, a <em>content</em> key from the digest of what it produced. The second is what makes
cache hits possible across histories that differ earlier: if two different parent chains happen to
produce byte-identical output, the child can still hit. This is why normalising outputs pays off far
beyond tidiness. A build step that stamps a timestamp into its result destroys content-key matching
for everything below it, even when the semantic content is unchanged.</p>

<h2>Where the mental model of layers stops being accurate</h2>
<p>The linear layer chain is a property of the exported image, not of the build. Internally stages are
independent subgraphs, <code>COPY --from</code> is an edge between them, and a stage nobody references
is never evaluated. Consequences follow directly: reordering two adjacent instructions with no data
dependency changes nothing about parallelism but changes both cache keys; adding a stage costs
nothing until something copies from it; and the frequently-repeated advice to minimise the number of
instructions optimises the export format while making cache boundaries coarser, which is usually the
wrong trade.</p>

<h2>Mount types as a separation of concerns</h2>
<p>Cache, bind, tmpfs and secret mounts all exist to keep state out of the snapshot. Secret mounts are
the security-relevant case: an <code>ARG</code> carrying a credential is recorded in the image config
and recoverable from the history, while a secret mount is present only in the executing step's mount
namespace and never enters any layer or any cache key. Cache mounts are the performance case, and
their sharing mode matters under concurrency: a shared mount can be entered by parallel builds at
once, which is correct for content-addressed package caches and actively unsafe for a package manager
that assumes exclusive use of a lock file.</p>

<h2>Claims that do not survive contact with the graph</h2>
<ul>
<li><strong>"Fewer layers means a faster build."</strong> It means a coarser cache. Merging an install
and a source copy into one RUN guarantees the install reruns on every code change.</li>
<li><strong>"The cache is invalidated by timestamps."</strong> COPY keys hash content, not mtime. What
invalidates is a change in bytes, in the instruction text, or in the parent.</li>
<li><strong>"Multi-stage builds are slower because they build more."</strong> Only reachable stages are
built, and reachable independent stages build in parallel.</li>
<li><strong>"Remote cache replaces local cache."</strong> Importing a remote cache still requires
fetching the blobs it references. On a fat build a cold import can cost more than rebuilding a cheap
step, which is why selective import beats importing everything.</li>
</ul>

<aside class="tip"><p>When a cache hit is expected and does not happen, compare the vertex inputs
rather than the Dockerfile. The usual culprit is a changed base image digest or a file that entered
the context because <code>.dockerignore</code> did not exclude it.</p></aside>
`,
    },
    problems: [
      {
        n: 1,
        title: "Which layers rebuild?",
        difficulty: "Medium",
        statement: `
<p>A builder decides whether an instruction can be served from cache by looking at the instruction
itself and at everything above it. Once one instruction misses, every instruction below it rebuilds
as well, because each layer is built on top of the previous one.</p>
<p>You are given a Dockerfile as an array of instructions and the list of files that changed since
the last build. Return the indices of the instructions that must be rebuilt, in ascending order.</p>
<p>Each instruction is an object:</p>
<pre>{ cmd: "FROM", args: "node:20-alpine" }
{ cmd: "COPY", src: ["package.json", "package-lock.json"] }
{ cmd: "RUN",  args: "npm ci" }</pre>
<p>The rules:</p>
<ul>
<li>Only <code>COPY</code> and <code>ADD</code> instructions can be invalidated by a changed file.
Every other instruction is invalidated only by something above it.</li>
<li>A source entry matches a changed path when the path is exactly that entry, when the path sits
underneath it (the path starts with the entry followed by <code>/</code>), or when the entry is
<code>"."</code>, which copies the whole context and therefore matches every changed path.</li>
<li>From the first invalidated instruction onwards, every instruction rebuilds.</li>
<li>If nothing is invalidated, return an empty array.</li>
</ul>
<p>For the Dockerfile above, a change to <code>src/index.js</code> leaves the install cached, while a
change to <code>package-lock.json</code> does not.</p>
`,
        fn: "cacheRebuild",
        params: "instructions, changed",
        tests: [
          {
            args: [
              [
                { cmd: "FROM", args: "node:20-alpine" },
                { cmd: "COPY", src: ["package.json", "package-lock.json"] },
                { cmd: "RUN", args: "npm ci" },
                { cmd: "COPY", src: ["src"] },
                { cmd: "RUN", args: "npm run build" },
              ],
              ["src/index.js"],
            ],
            expected: [3, 4],
            label: "source change keeps the install cached",
          },
          {
            args: [
              [
                { cmd: "FROM", args: "node:20-alpine" },
                { cmd: "COPY", src: ["package.json", "package-lock.json"] },
                { cmd: "RUN", args: "npm ci" },
                { cmd: "COPY", src: ["src"] },
                { cmd: "RUN", args: "npm run build" },
              ],
              ["package-lock.json"],
            ],
            expected: [1, 2, 3, 4],
            label: "manifest change invalidates the install",
          },
          {
            args: [
              [
                { cmd: "FROM", args: "node:20-alpine" },
                { cmd: "COPY", src: ["package.json", "package-lock.json"] },
                { cmd: "RUN", args: "npm ci" },
                { cmd: "COPY", src: ["src"] },
                { cmd: "RUN", args: "npm run build" },
              ],
              [],
            ],
            expected: [],
            label: "nothing changed",
          },
          {
            args: [
              [
                { cmd: "FROM", args: "node:20-alpine" },
                { cmd: "COPY", src: ["package.json", "package-lock.json"] },
                { cmd: "RUN", args: "npm ci" },
                { cmd: "COPY", src: ["src"] },
                { cmd: "RUN", args: "npm run build" },
              ],
              ["README.md", "docs/adr/0004.md"],
            ],
            expected: [],
            label: "unrelated files touch nothing",
          },
          {
            args: [
              [
                { cmd: "FROM", args: "node:20-alpine" },
                { cmd: "COPY", src: ["."] },
                { cmd: "RUN", args: "npm ci" },
                { cmd: "RUN", args: "npm run build" },
              ],
              ["README.md"],
            ],
            expected: [1, 2, 3],
            label: "copying the whole context is the anti-pattern",
          },
          {
            args: [
              [
                { cmd: "FROM", args: "node:20-alpine" },
                { cmd: "COPY", src: ["package.json", "package-lock.json"] },
                { cmd: "RUN", args: "npm ci" },
                { cmd: "COPY", src: ["src"] },
                { cmd: "RUN", args: "npm run build" },
              ],
              ["src/util/date.js"],
            ],
            expected: [3, 4],
            label: "nested path under a copied directory",
            hidden: true,
          },
          {
            args: [[], ["src/index.js"]],
            expected: [],
            label: "empty dockerfile",
            hidden: true,
          },
        ],
        hints: [
          "You are looking for one number first: the index of the earliest instruction that cannot be served from cache. Everything after it follows automatically.",
          "Only COPY and ADD read from the build context, so only those two need to be compared against the changed file list. Every other instruction inherits its fate from the instruction above it.",
          "Write a small helper that answers whether one source entry matches one changed path: true when the entry is \".\", when the two strings are equal, or when the path starts with the entry plus a slash. Then scan for the first instruction where any entry matches any changed path, and return every index from there to the end.",
        ],
        solution: `function cacheRebuild(instructions, changed) {
  const list = Array.isArray(instructions) ? instructions : [];
  const files = Array.isArray(changed) ? changed : [];

  function matches(entry, filePath) {
    if (entry === ".") return true;
    if (entry === filePath) return true;
    return filePath.startsWith(entry + "/");
  }

  let firstMiss = -1;
  for (let i = 0; i < list.length; i++) {
    const step = list[i];
    if (step.cmd !== "COPY" && step.cmd !== "ADD") continue;
    const sources = Array.isArray(step.src) ? step.src : [];
    const hit = sources.some((entry) => files.some((filePath) => matches(entry, filePath)));
    if (hit) { firstMiss = i; break; }
  }

  if (firstMiss === -1) return [];
  const out = [];
  for (let i = firstMiss; i < list.length; i++) out.push(i);
  return out;
}`,
        skills: ["Build cache invalidation", "Instruction ordering"],
      },
      {
        n: 2,
        title: "What a multi-stage build actually ships",
        difficulty: "Medium",
        statement: `
<p>A multi-stage Dockerfile contains several stages. A stage is built only if the target stage
depends on it, directly or through another stage, and only the target stage's own contents end up in
the shipped image. Everything built along the way is discarded.</p>
<p>You are given the stages and the name of the stage being targeted:</p>
<pre>[
  { name: "deps",    size: 310, from: [] },
  { name: "build",   size: 540, from: ["deps"] },
  { name: "test",    size: 120, from: ["build"] },
  { name: "runtime", size:  92, from: ["build"] }
]</pre>
<p>Return an object <code>{ built, shipped }</code> where:</p>
<ul>
<li><code>built</code> is the list of stage names that must be built, including the target itself,
sorted alphabetically;</li>
<li><code>shipped</code> is the size of the target stage alone, because that is the only stage whose
layers reach the registry.</li>
</ul>
<p>If the target does not name a stage in the list, return <code>{ built: [], shipped: 0 }</code>.
A stage may be reached by more than one path and must still appear only once.</p>
`,
        fn: "stagePlan",
        params: "stages, target",
        tests: [
          {
            args: [
              [
                { name: "deps", size: 310, from: [] },
                { name: "build", size: 540, from: ["deps"] },
                { name: "test", size: 120, from: ["build"] },
                { name: "runtime", size: 92, from: ["build"] },
              ],
              "runtime",
            ],
            expected: { built: ["build", "deps", "runtime"], shipped: 92 },
            label: "the test stage is never built",
          },
          {
            args: [
              [
                { name: "deps", size: 310, from: [] },
                { name: "build", size: 540, from: ["deps"] },
                { name: "test", size: 120, from: ["build"] },
                { name: "runtime", size: 92, from: ["build"] },
              ],
              "test",
            ],
            expected: { built: ["build", "deps", "test"], shipped: 120 },
            label: "targeting the test stage in CI",
          },
          {
            args: [[{ name: "app", size: 480, from: [] }], "app"],
            expected: { built: ["app"], shipped: 480 },
            label: "single stage",
          },
          {
            args: [
              [
                { name: "deps", size: 310, from: [] },
                { name: "build", size: 540, from: ["deps"] },
              ],
              "publish",
            ],
            expected: { built: [], shipped: 0 },
            label: "unknown target",
          },
          {
            args: [
              [
                { name: "base", size: 200, from: [] },
                { name: "assets", size: 150, from: ["base"] },
                { name: "server", size: 260, from: ["base"] },
                { name: "runtime", size: 74, from: ["assets", "server"] },
              ],
              "runtime",
            ],
            expected: { built: ["assets", "base", "runtime", "server"], shipped: 74 },
            label: "diamond dependency counted once",
            hidden: true,
          },
          {
            args: [[], "runtime"],
            expected: { built: [], shipped: 0 },
            label: "no stages at all",
            hidden: true,
          },
        ],
        hints: [
          "Two separate questions are being asked. One is about reachability through the graph, the other is a single lookup on the target.",
          "Index the stages by name first. Then walk out from the target following its from list, remembering which names you have already visited so a stage reached twice is only added once.",
          "A stack or a queue plus a Set is enough: push the target, and while the stack is not empty pop a name, skip it if already seen, mark it seen, and push everything in its from list. Sort the seen names at the end and read the target's own size for shipped.",
        ],
        solution: `function stagePlan(stages, target) {
  const list = Array.isArray(stages) ? stages : [];
  const byName = new Map(list.map((s) => [s.name, s]));
  if (!byName.has(target)) return { built: [], shipped: 0 };

  const seen = new Set();
  const stack = [target];
  while (stack.length) {
    const name = stack.pop();
    if (seen.has(name)) continue;
    const stage = byName.get(name);
    if (!stage) continue;
    seen.add(name);
    for (const dep of stage.from || []) stack.push(dep);
  }

  const built = Array.from(seen).sort();
  return { built, shipped: byName.get(target).size };
}`,
        skills: ["Multi-stage builds", "Instruction ordering"],
      },
    ],
  },
  5054: {
    topicId: 5054,
    title: "IAM, and least privilege in practice",
    summary:
      "Read an access decision the way AWS evaluates it, replace long-lived keys with assumed roles, and tighten a policy from working-but-broad to least privilege without breaking the workload halfway through.",
    concepts: [
      "Principals and identities",
      "Policy evaluation logic",
      "Roles and temporary credentials",
      "Resource-based policies",
      "Permission boundaries",
      "Least privilege iteration",
    ],
    glossary: {
      Principal:
        "The entity making a request: an IAM user, an assumed role session, an AWS service acting on your behalf, or an account.",
      Role: "An identity with permissions but no credentials of its own, which principals assume to receive temporary credentials.",
      "Trust policy":
        "The resource-based policy attached to a role that says who is allowed to assume it. Separate from the permissions the role grants.",
      "Identity-based policy":
        "A policy attached to a user, group or role, describing what that identity may do.",
      "Resource-based policy":
        "A policy attached to a resource such as an S3 bucket or a KMS key, naming the principals allowed to act on it.",
      "Permission boundary":
        "A policy attached to an identity that caps the maximum permissions it can ever have. Effective permissions are the intersection of the boundary and the granting policies.",
      "Service control policy":
        "An organisation-level filter, usually written SCP, that limits what any principal in an account may do. It grants nothing on its own.",
      "Condition key":
        "A value in the request context, such as the source VPC endpoint or whether MFA was used, that a policy can test before allowing an action. A Deny carrying one still overrides every Allow.",
    },
    body: {
      Beginner: `
<p>IAM answers one question, over and over: is <em>this</em> caller allowed to perform <em>this
action</em> on <em>this resource</em>, right now? Everything in the service exists to make that
answer come out correctly.</p>

<h2>Three words worth separating</h2>
<ul>
<li>A <strong>user</strong> is a person or a script with a password or an access key. It exists
permanently and its credentials do not expire on their own.</li>
<li>A <strong>group</strong> is a bucket of users you attach permissions to once instead of many
times. Groups have no credentials and nothing ever logs in as a group.</li>
<li>A <strong>role</strong> is a set of permissions with no credentials attached. Something
<em>assumes</em> it and receives keys that expire in an hour.</li>
</ul>
<p>Roles are the important one. Almost everything that runs on AWS should use a role, because a
credential that expires in an hour is a far smaller problem than one committed to a repository in
2023 and still valid today.</p>

<h2>Deny always wins</h2>
<p>A request is allowed only when some policy explicitly allows it and nothing anywhere denies it.
The default is denial. If you have granted nothing, nothing is permitted, and adding a Deny to any
policy in the chain ends the discussion regardless of how many Allows exist elsewhere.</p>

<h2>What least privilege means day to day</h2>
<p>It does not mean guessing the perfect policy in advance. It means starting with what the workload
needs, watching what it actually calls, and narrowing until it stops working, then stepping back one
notch. A policy with a wildcard action on every resource is quick to write and impossible to reason
about later.</p>

<aside class="tip"><p>If you are about to create an access key for something that runs inside AWS,
stop. An EC2 instance, an ECS task and a Lambda function can all be given a role directly, and the
SDK will find those credentials without any configuration.</p></aside>

<p>The habit worth building is small: every time you write a policy, name the specific actions and
the specific resources. It takes two extra minutes and it is the difference between a mistake that
costs one bucket and a mistake that costs the account.</p>
`,
      Intermediate: `
<p>Access decisions in AWS are the output of an evaluation algorithm, not a lookup. Once you can run
that algorithm in your head, most confusing permission errors stop being mysterious.</p>

<h2>The evaluation order</h2>
<ol>
<li>Collect every applicable policy: identity-based policies on the principal, the resource-based
policy on the target, any permission boundary, any session policy, and any SCP on the account.</li>
<li>If any of them contains a matching <strong>explicit Deny</strong>, the request fails. Nothing
overrides this.</li>
<li>SCPs act as a filter. If an SCP applies and does not allow the action, the request fails even
when the identity policy allows it. SCPs never grant anything.</li>
<li>A permission boundary acts the same way for the identity it is attached to: it caps, it does not
grant.</li>
<li>What remains must contain an explicit Allow. Absence of an Allow is denial.</li>
</ol>
<p>One important asymmetry: within a single account, an S3 request succeeds if <em>either</em> the
identity policy or the bucket policy allows it. Across accounts, both sides must allow it, because
each account is answering the question for its own principals and its own resources independently.</p>

<h2>Roles and temporary credentials</h2>
<p>A role has two policies that people constantly conflate. The <strong>trust policy</strong> says who
may assume it. The <strong>permissions policy</strong> says what the resulting session may do. An
"is not authorised to perform sts:AssumeRole" error is a trust policy problem; an access denied after
assuming successfully is a permissions problem. Reading which of the two the error names saves a great
deal of time.</p>
<p>Temporary credentials come from STS and carry an expiry. Prefer them everywhere: instance profiles
for EC2, task roles for ECS, execution roles for Lambda, and OIDC federation for CI systems so a
pipeline can assume a role using a signed identity token rather than a stored key.</p>

<h2>Conditions carry most of the precision</h2>
<p>Actions and resources describe what is possible. Conditions describe when. A few that repeatedly
earn their place:</p>
<ul>
<li><code>aws:PrincipalOrgID</code> on a resource policy, so access is limited to your own
organisation even if a principal ARN is mistyped.</li>
<li><code>aws:SourceVpce</code> or <code>aws:SourceIp</code>, so data can only leave through a path
you control.</li>
<li><code>aws:MultiFactorAuthPresent</code> for anything destructive performed by a human.</li>
<li><code>sts:ExternalId</code> on a role trusted by a third party, which is the standard defence
against the confused deputy problem.</li>
</ul>

<h2>Getting to least privilege without an outage</h2>
<p>Grant broadly in a non-production account, run the workload, then read the recorded API calls and
generate a policy from what was genuinely used. Apply the narrow policy in staging, watch for denials,
and only then promote. Access Analyzer can propose a policy from recorded activity, which turns a
guessing exercise into a review exercise.</p>

<aside class="tip"><p>Wildcards in the resource field are far more dangerous than wildcards in the
action field. <code>s3:Get*</code> on one bucket is a bounded blast radius; <code>s3:GetObject</code>
on <code>*</code> is every bucket in the account, including the one holding your backups.</p></aside>
`,
      Advanced: `
<p>At scale IAM stops being about individual policies and becomes about invariants: properties that
hold no matter what an individual team writes. That shift changes which mechanisms matter.</p>

<h2>Guardrails versus grants</h2>
<p>SCPs and permission boundaries are the only tools that constrain rather than permit, and they are
what let you delegate policy authorship safely. A workload team may create roles freely as long as
every role they create carries a boundary they cannot remove, enforced by a condition on
<code>iam:PermissionsBoundary</code> in the policy that lets them call <code>iam:CreateRole</code>.
Without that condition, permission to create roles is permission to escalate to whatever the account
allows.</p>

<h2>Privilege escalation paths that pass review</h2>
<ul>
<li><strong>iam:PassRole without a resource constraint.</strong> A principal that may pass any role to
a compute service can launch a task as the administrator role and inherit it.</li>
<li><strong>iam:CreatePolicyVersion or AttachUserPolicy on itself.</strong> The identity can grant
itself anything, and the policy that permitted it looked narrow because it named only IAM actions.</li>
<li><strong>Trust policies with a bare account principal.</strong> Trusting <code>root</code> of
another account trusts every principal in that account, present and future, not the one role you
discussed.</li>
<li><strong>Wildcard principals with weak conditions.</strong> A resource policy with
<code>"Principal": "*"</code> guarded only by a source IP is public to anyone who can route from that
IP.</li>
</ul>

<h2>Cross-account access, done properly</h2>
<p>The durable pattern is a role in the resource-owning account with a trust policy naming the calling
account and a condition on either an external ID or the organisation ID, plus an identity policy in
the calling account permitting <code>sts:AssumeRole</code> on that specific role ARN. Both sides
remain independently auditable, and revocation is a one-line change on either side. Sharing an access
key achieves the same access with none of those properties.</p>

<h2>Encryption changes the evaluation</h2>
<p>KMS does not follow the same "either side may allow" shortcut. A key policy must permit the
principal, and permission on the data service alone is insufficient. This is the usual explanation for
a cross-account S3 read that fails with access denied while the bucket policy plainly allows it: the
object is encrypted with a customer managed key whose key policy has never heard of the caller.</p>

<aside class="tip"><p>Audit for the shape of a policy, not only its contents. Statements with
<code>"Resource": "*"</code>, wildcard principals, and any grant of <code>iam:*</code> or
<code>sts:AssumeRole</code> on <code>*</code> are worth flagging automatically, because they are the
statements that turn a small mistake into an account-wide one.</p></aside>
`,
      Expert: `
<p>The interesting properties of IAM are consequences of it being a distributed, eventually consistent
authorisation system whose decision function is a fixed lattice over five policy types. Treating it as
that, rather than as a permissions UI, explains both the security model and its operational quirks.</p>

<h2>The decision function</h2>
<p>For a given request context the evaluator computes, over the union of applicable policies, whether
any explicit Deny matches; whether every restricting policy type that applies (SCPs, permission
boundary, session policy, and in the cross-account case the resource policy) yields an Allow; and
whether at least one granting policy yields an Allow. Denial is the identity element. Because
restricting types intersect and granting types union, adding a policy can never increase permissions
past a boundary, and removing a boundary can silently increase them across every identity it covered.
This is why boundary removal deserves the same review weight as an administrator grant.</p>

<h2>Consistency is not instantaneous</h2>
<p>IAM is globally replicated with eventual consistency. A newly created role, a just-attached policy
or a freshly rotated trust relationship can be visible in one region before another, which produces
the classic Terraform failure where a resource that passes a role to a service is created microseconds
after the role and fails with a validation error about an invalid principal. The correct remedy is a
retry with backoff on principal-not-found style errors, not a fixed sleep, and not eliminating the
dependency.</p>

<h2>Session policies and the delegation ceiling</h2>
<p>A session policy passed at AssumeRole time intersects with the role's permissions, which makes it
the right primitive for multi-tenant systems: one broad role, and per-request sessions scoped to a
single tenant prefix by a generated policy. The ceiling is a hard limit on serialised policy size, so
scoping by enumerating tenant resources does not scale and scoping by a path prefix and a tagged
condition does. Attribute-based access control using <code>aws:PrincipalTag</code> matched against
<code>aws:ResourceTag</code> is the general form: one policy whose behaviour varies with the session,
rather than one policy per tenant.</p>

<h2>Where the documentation misleads</h2>
<ul>
<li><strong>"Least privilege" is presented as an end state.</strong> It is a rate of change. A policy
that was minimal when written accumulates unused permissions as the workload evolves, so the real
control is periodic removal of unused actions, not the original authorship.</li>
<li><strong>Last-accessed data has blind spots.</strong> It is service-level for many services and
lags by hours, so an action absent from it is not proven unused. Narrow, then observe denials with an
alarm on them, rather than treating absence of evidence as evidence of absence.</li>
<li><strong>NotAction and NotResource read as convenience and behave as a trap.</strong> They allow
everything except what is listed, which means every service AWS launches tomorrow is included
automatically.</li>
<li><strong>Policy evaluation depends on request context you may not control.</strong> Conditions on
values a caller can influence, such as a user agent or a tag supplied in the request, are advisory.
Only context injected by the service itself, such as the source VPC endpoint or the presence of MFA,
is trustworthy.</li>
</ul>
`,
    },
    questions: [
      {
        n: 1,
        question:
          "An identity policy on a role allows s3:GetObject on every object in the reports bucket. The only service control policy attached to the account allows just ec2:* and cloudwatch:*. What happens when the role calls GetObject?",
        options: [
          "The call succeeds, because service control policies only apply to IAM users, not roles.",
          "The call is denied, because a service control policy filters every request in the account and this one does not allow S3.",
          "The call succeeds, because the identity policy is more specific than the account-wide policy.",
          "The call succeeds but is logged as a policy violation for later review.",
        ],
        answer: 1,
        explanation:
          "A service control policy is a filter, not a grant. An action must be allowed by the SCP and by an identity policy, so an SCP that never mentions S3 removes S3 from every principal in the account, roles included. The tempting answer is specificity: IAM has no such rule. Statement specificity never overrides a restricting policy type, and only an explicit Deny has priority semantics at all.",
        difficulty: "Easy",
        skill: "Policy evaluation logic",
      },
      {
        n: 2,
        question:
          "A user is in a group whose policy allows dynamodb:* on all tables. A policy attached directly to the user denies dynamodb:DeleteTable on one specific table. What can the user do to that table?",
        options: [
          "Everything including DeleteTable, because the group grant is broader.",
          "Nothing at all, because the deny invalidates the group policy entirely.",
          "Everything except DeleteTable on that table.",
          "Only read actions, because a deny on any write action removes all writes.",
        ],
        answer: 2,
        explanation:
          "Explicit deny beats any allow, but only for what it actually matches: this deny names one action on one resource, so exactly that combination fails and the rest of the group grant stands. The trap is assuming a deny poisons the whole policy set. Denies are evaluated per action and per resource, not per policy, so nothing outside the matched statement is affected.",
        difficulty: "Easy",
        skill: "Policy evaluation logic",
      },
      {
        n: 3,
        question:
          "A deployment script running on an EC2 instance needs to read from S3. Which approach gives the smallest window of exposure if the instance is compromised?",
        options: [
          "Create an IAM user, generate an access key, and place it in a file on the instance with permissions set to 0600.",
          "Attach an instance profile with a role granting only the required S3 actions, and let the SDK obtain temporary credentials.",
          "Create an IAM user with an access key and rotate the key every ninety days by a scheduled job.",
          "Store an access key in an environment variable rather than a file, so it never touches the disk.",
        ],
        answer: 1,
        explanation:
          "An instance profile delivers credentials that expire within hours and are refreshed automatically, so stolen credentials have a short useful life and nothing needs to be distributed or rotated. Environment variables sound safer than files but are readable by any process in the same context and are routinely captured in crash dumps and process listings, and the key behind them stays valid until someone notices and revokes it.",
        difficulty: "Medium",
        skill: "Roles and temporary credentials",
      },
      {
        n: 4,
        question:
          "A CI pipeline calls sts:AssumeRole for a deployment role and receives an error stating that the pipeline principal is not authorised to perform sts:AssumeRole on that role. Which document should you fix first?",
        options: [
          "The permissions policy attached to the deployment role, which is missing the deployment actions.",
          "The trust policy on the deployment role, which does not list the pipeline principal.",
          "The service control policy, because AssumeRole is always blocked by default at the account level.",
          "The permission boundary on the deployment role, which caps its maximum permissions.",
        ],
        answer: 1,
        explanation:
          "The error names sts:AssumeRole, which fails before the role's own permissions are ever consulted, so the document deciding it is the trust policy that says who may assume the role. Fixing the permissions policy is the common reflex and changes nothing here: those permissions only take effect once a session exists, and no session was created.",
        difficulty: "Medium",
        skill: "Roles and temporary credentials",
      },
      {
        n: 5,
        question:
          "Account A must read objects from a bucket owned by account B. What is required for the request to succeed?",
        options: [
          "Only the bucket policy in account B, since the resource owner has final say.",
          "Only the identity policy in account A, since the caller is the one being authorised.",
          "Both an allow in account A's identity policy and an allow in account B's bucket policy.",
          "A bucket policy in account B plus a service control policy in account A naming the bucket.",
        ],
        answer: 2,
        explanation:
          "Cross-account access requires both sides to allow independently: the resource owner decides which external principals it trusts, and the caller's account decides whether its own principals may make that call. Assuming the bucket policy alone is enough is the usual mistake, and it works only within a single account, where an allow in either the identity policy or the resource policy is sufficient.",
        difficulty: "Medium",
        skill: "Resource-based policies",
      },
      {
        n: 6,
        question:
          "Within one account, a bucket policy allows s3:GetObject to a role, but the role has no S3 statement in any identity policy. What is the outcome, and how does it change if the objects are encrypted with a customer managed KMS key that does not name the role?",
        options: [
          "It fails in both cases, because an identity policy allow is always required.",
          "It succeeds in both cases, because the bucket policy is a resource policy and resource policies take precedence.",
          "It succeeds normally, but fails once KMS is involved unless the key policy also permits the role.",
          "It succeeds in both cases, because S3 automatically grants decrypt permission to any principal allowed to read the object.",
        ],
        answer: 2,
        explanation:
          "Same-account S3 access is allowed if either the identity policy or the bucket policy permits it, so the bare bucket policy is sufficient on its own. KMS does not share that shortcut: decryption is a separate authorisation against the key policy, so an object encrypted with a customer managed key fails with access denied even though S3 itself would have allowed the read. Expecting S3 to pass through decrypt rights is the trap, and it is the most common cause of a confusing denial on a bucket whose policy looks correct.",
        difficulty: "Hard",
        skill: "Resource-based policies",
      },
      {
        n: 7,
        question:
          "A role has an identity policy allowing s3:* and ec2:* and a permission boundary allowing only s3:GetObject and s3:PutObject. What can the role actually do?",
        options: [
          "s3:GetObject and s3:PutObject only.",
          "Everything in s3 and ec2, because boundaries apply only when creating new identities.",
          "Everything in s3, because the boundary allows S3 and the identity policy widens it.",
          "Nothing, because the boundary and the identity policy disagree.",
        ],
        answer: 0,
        explanation:
          "Effective permissions are the intersection of the granting policy and the boundary, so only the two actions present in both survive. Reading the boundary as a grant that can be widened inverts its purpose: a boundary never adds anything, it only caps, which is exactly what makes it safe to hand role creation to a team.",
        difficulty: "Medium",
        skill: "Permission boundaries",
      },
      {
        n: 8,
        question:
          "You want a platform team to create their own IAM roles without being able to grant themselves administrator access. Which control achieves this?",
        options: [
          "Grant iam:CreateRole and review every new role in a weekly audit.",
          "Grant iam:CreateRole with a condition requiring that a specific permission boundary is attached, and deny removing or changing that boundary.",
          "Grant iam:CreateRole but deny iam:AttachRolePolicy, so no permissions can ever be added.",
          "Grant iam:CreateRole only in a separate account, so any escalation is contained.",
        ],
        answer: 1,
        explanation:
          "Requiring a boundary at creation time and preventing its removal makes the cap structural: whatever policies the team attaches afterwards, the intersection can never exceed the boundary. Weekly review detects an escalation after it has happened rather than preventing it, and denying AttachRolePolicy makes the delegation useless because the team can create roles that can do nothing.",
        difficulty: "Hard",
        skill: "Permission boundaries",
      },
      {
        n: 9,
        question:
          "A service currently runs with a wildcard policy and you need to reach least privilege without an outage. What is the most reliable sequence?",
        options: [
          "Write the narrowest policy you can reason about and apply it directly in production, then fix failures as they are reported.",
            "Record the API calls the workload actually makes over a representative period, generate a candidate policy from them, apply it in a lower environment, watch for denials, then promote.",
          "Remove all permissions and add them back one at a time in production until the service starts working.",
          "Replace the wildcard with a list of every action the service documentation mentions, which guarantees coverage.",
        ],
        answer: 1,
        explanation:
          "Deriving the policy from observed calls replaces guesswork with evidence, and validating in a lower environment means a missed action surfaces as a denial you can see rather than an incident. Copying every action from the documentation is the seductive shortcut: it produces a policy far broader than the workload needs, including destructive actions the service will never call, so it satisfies the letter of the exercise and none of its purpose.",
        difficulty: "Medium",
        skill: "Least privilege iteration",
      },
      {
        n: 10,
        question:
          "A vendor asks you to create a role their account can assume. Which trust policy design best prevents the confused deputy problem?",
        options: [
          "Trust the vendor's account root principal with no conditions, since you already trust the vendor.",
          "Trust a wildcard principal restricted by the vendor's public IP range.",
          "Trust the vendor's account and require a condition on sts:ExternalId set to a value unique to your relationship.",
          "Trust the vendor's account and require multi-factor authentication on the assume call.",
        ],
        answer: 2,
        explanation:
          "An external ID is a secret shared only between you and the vendor for your specific tenancy, so the vendor's software cannot be tricked by another customer into assuming your role. Trusting the account root alone is the tempting option because it looks scoped, but it authorises every principal in the vendor's account, which includes any other customer's workload running there. MFA is not applicable to an automated cross-account service call.",
        difficulty: "Medium",
        skill: "Principals and identities",
      },
      {
        n: 11,
        question:
          "Which statement about IAM groups is correct?",
        options: [
          "A group can be named as the Principal in a bucket policy to grant the whole group access.",
          "A group is an identity that can be assumed like a role to obtain temporary credentials.",
          "A group has no credentials and cannot be a principal in a resource policy; it only attaches policies to its member users.",
          "A group can be nested inside another group so permissions inherit down the hierarchy.",
        ],
        answer: 2,
        explanation:
          "Groups are purely an attachment convenience for users: nothing authenticates as a group, so a group cannot appear as a Principal in a resource policy and cannot be assumed. Naming a group in a bucket policy is a common attempt that fails validation, and the workaround people actually want is a role that the relevant users are permitted to assume.",
        difficulty: "Easy",
        skill: "Principals and identities",
      },
    ],
  },
  5055: {
    topicId: 5055,
    title: "Networking: VPC, subnets, security groups",
    summary:
      "Lay out a VPC that will still make sense in two years, decide correctly whether a subnet needs internet reachability, and debug a connectivity failure by checking route tables, security groups and network ACLs in the order that actually narrows the problem.",
    concepts: [
      "CIDR planning",
      "Public and private subnets",
      "Route tables and gateways",
      "Security groups",
      "Network ACLs",
      "VPC endpoints",
    ],
    glossary: {
      "CIDR block":
        "An address range written as a base address and a prefix length, such as 10.0.0.0/16, which fixes how many addresses the range contains.",
      Subnet:
        "A slice of the VPC CIDR that lives in exactly one availability zone and is associated with exactly one route table.",
      "Internet gateway":
        "A horizontally scaled VPC component that allows traffic between the VPC and the internet. A subnet whose route table points at one is public.",
      "NAT gateway":
        "A managed device in a public subnet that lets instances in private subnets make outbound connections without being reachable from outside.",
      "Route table":
        "An ordered set of destination-to-target rules, matched most specific prefix first, that decides where traffic leaving a subnet goes.",
      "Security group":
        "A stateful virtual firewall attached to an elastic network interface, containing allow rules only.",
      "Network ACL":
        "A stateless, numbered allow and deny list applied at the subnet boundary, evaluated in rule order.",
      "VPC endpoint":
        "A private path from your VPC to an AWS service. A gateway endpoint adds a route; an interface endpoint creates an elastic network interface, the virtual network card that carries an address and the security groups, inside your subnets.",
    },
    body: {
      Beginner: `
<p>A VPC is your own private section of the network inside a region. Nothing in it is reachable from
the internet unless you deliberately arrange for that, and building the arrangement is most of what
this lesson covers.</p>

<h2>Addresses first</h2>
<p>You choose a range of private addresses when you create the VPC, written like
<code>10.0.0.0/16</code>. The number after the slash says how much of the address is fixed: a
<code>/16</code> fixes the first sixteen bits, leaving about sixty five thousand addresses. A
<code>/24</code> fixes twenty four bits and leaves 256. Smaller number, bigger range.</p>
<p>You then cut that range into <strong>subnets</strong>. Each subnet lives in one availability zone,
which is one physical cluster of data centres. Two subnets in two zones is the minimum for anything
that should survive one zone going away.</p>

<h2>Public and private</h2>
<p>There is no checkbox marked public. A subnet is public because its route table sends unknown
traffic to an <strong>internet gateway</strong>. If it does not, the subnet is private, and machines
in it cannot be reached from outside and cannot reach outside either.</p>
<p>Private machines usually still need to make outbound calls, to download a package or call an API.
That is what a <strong>NAT gateway</strong> is for: it sits in a public subnet, forwards their
outbound traffic, and allows nothing inbound.</p>

<aside class="tip"><p>The rule of thumb is simple. Load balancers go in public subnets. Your
application and your database go in private subnets. If something does not need to be reached from
the internet, it should not be able to be.</p></aside>

<h2>Two firewalls, not one</h2>
<p>A <strong>security group</strong> wraps around the machine and only contains allow rules. It is
stateful, which means if you allow a connection in, the reply is automatically allowed back out. You
do not write a rule for the response.</p>
<p>A <strong>network ACL</strong> sits at the subnet edge and is stateless. It checks each direction
separately, so allowing traffic in does not allow the reply out. Most designs leave the network ACL
wide open and do all the work in security groups, which is far easier to get right.</p>

<h2>When it does not connect</h2>
<p>Check in this order: is there a route to the destination, does the security group on the target
allow the source, and does anything in the network ACL block it. Nearly every failure is one of the
first two.</p>
`,
      Intermediate: `
<p>Most VPC problems are made at design time and paid for later. Addressing is the part you cannot
change without rebuilding, so it deserves the most thought before anything is created.</p>

<h2>Plan the addresses for the organisation, not the project</h2>
<p>Allocate a distinct, non-overlapping range per VPC from a single organisational plan. Overlapping
ranges are the one mistake that cannot be resolved later: two VPCs with overlapping CIDRs cannot be
peered, cannot be joined to the same transit gateway, and cannot route to each other through any
means short of network address translation. Reserve generously, because a /16 costs nothing and a
re-address costs a migration.</p>
<p>Within a VPC, size subnets by role and zone. AWS reserves five addresses in every subnet, so a /24
provides 251 usable, and workloads that allocate an address per pod or per task consume them far
faster than a headcount estimate suggests.</p>

<h2>Routing decides reachability</h2>
<p>Every subnet is associated with exactly one route table, and the most specific matching prefix
wins. The local route covering the VPC CIDR is present in every table and cannot be removed, which is
why everything in a VPC can reach everything else in it by default at the routing layer. Beyond that:</p>
<ul>
<li>A default route to an internet gateway makes the subnet public. An instance in it also needs a
public IP address to be reachable, because the gateway performs a one-to-one translation.</li>
<li>A default route to a NAT gateway gives outbound-only internet access. The NAT gateway itself must
sit in a public subnet, and one per availability zone avoids both a single point of failure and
cross-zone data charges.</li>
<li>Routes to a peering connection, a transit gateway or a virtual private gateway extend reachability
to other networks, and must be added on both sides.</li>
</ul>

<h2>Security groups are the useful firewall</h2>
<p>They are stateful and allow-only, attached to network interfaces rather than subnets. The feature
that matters most in practice is that a rule can name another security group as its source. Instead of
maintaining address ranges, you say the database group accepts port 5432 from the application group.
The rule keeps working as instances are replaced, scaled and moved between zones, because it describes
membership rather than topology.</p>

<h2>Network ACLs, and when they earn their place</h2>
<p>Because they are stateless, an ACL that allows inbound traffic on port 443 must also allow outbound
traffic on the ephemeral port range for the responses, and the reverse for outbound connections.
Forgetting this produces a failure that looks intermittent because it depends on which port the client
happened to pick. Keep the default allow-all ACL for ordinary designs and reserve custom ACLs for a
genuine subnet-wide deny, such as blocking a known bad range, which security groups cannot express.</p>

<h2>Endpoints keep traffic off the internet</h2>
<p>A gateway endpoint for S3 or DynamoDB adds a prefix-list route to your route table and costs
nothing, removing both the NAT data processing charge and the exposure of that traffic to the public
internet. An interface endpoint places an ENI in your subnets for the service, carries an hourly and
per-gigabyte charge, and, because it is an ENI, takes a security group.</p>

<aside class="tip"><p>When a connection fails, resolve the layer before you change anything. No route
means a timeout with no response at all; a security group denial also times out; a network ACL denial
on the return path times out too. A connection refused, by contrast, means the packets arrived and
nothing was listening, so networking is fine and the problem is the process.</p></aside>
`,
      Advanced: `
<p>Once the basic layout is right, the failures that remain come from asymmetry, from exhaustion, and
from paths people assumed existed. Each has a characteristic signature.</p>

<h2>Asymmetry is the ACL failure mode</h2>
<p>Security groups cannot produce an asymmetric failure, because state is tracked per connection. ACLs
can, and they do it in a way that survives casual testing: an inbound allow on 443 with no outbound
ephemeral allow lets the handshake begin and drops the response, so a health check on a short timeout
fails while a manual test with a longer one appears to work. Any connectivity bug that behaves
differently for long-lived and short-lived connections should point you at the stateless layer first.</p>

<h2>Address exhaustion arrives suddenly</h2>
<p>Container platforms that assign an ENI or a secondary address per task consume subnet space at a
rate unrelated to instance count. The symptom is a scaling event that fails to place tasks while CPU
and memory show plenty of headroom, and the error names an insufficient free address count rather than
anything about capacity. Because a subnet CIDR cannot be resized, the remedy is adding a secondary
CIDR block to the VPC and creating new subnets, which is why the original plan should leave room.</p>

<h2>NAT is a chokepoint with three separate costs</h2>
<ul>
<li><strong>Data processing</strong>, charged per gigabyte through the gateway, on top of any egress
charge.</li>
<li><strong>Cross-zone traffic</strong>, if instances in one zone use a NAT gateway in another.</li>
<li><strong>Port exhaustion</strong>, since a NAT gateway supports a bounded number of simultaneous
connections to a single destination address and port. A fleet polling one external endpoint hard
enough will hit it, and the error surfaces as intermittent connection failures rather than anything
that names NAT.</li>
</ul>
<p>Traffic to AWS services is the largest avoidable share, which makes gateway endpoints for S3 and
DynamoDB the single highest-yield networking change in most accounts.</p>

<h2>DNS and endpoints interact</h2>
<p>Interface endpoints with private DNS enabled override the public hostname for the service inside the
VPC, so existing code needs no change. That override depends on DNS hostnames and DNS resolution both
being enabled on the VPC, and it applies to the whole VPC, so an endpoint reachable from only some
subnets creates resolution that succeeds and connections that time out from the rest. Either place the
endpoint ENI in every subnet that needs it or leave private DNS off and address the endpoint
explicitly.</p>

<h2>Peering does not transit</h2>
<p>Peering connections are strictly point to point and non-transitive. If A peers with B and B peers
with C, A cannot reach C, and no route table entry will change that. Beyond a handful of VPCs the
number of connections and route entries grows quadratically, which is the point at which a transit
gateway becomes the right structure rather than an optional one.</p>

<aside class="tip"><p>Reachability Analyzer answers the routing and rule question definitively and
in seconds, naming the exact component that blocks a path. It is considerably faster than reading four
route tables, and unlike a packet capture it works when the instance never receives the packet.</p></aside>
`,
      Expert: `
<p>A VPC is a software defined network implemented as a mapping service in the hypervisor layer. Almost
every property that seems arbitrary follows from that implementation, and knowing it changes what you
expect to be possible.</p>

<h2>There is no broadcast domain</h2>
<p>Packets are encapsulated and forwarded according to a per-interface mapping rather than switched on
a shared segment. Consequently broadcast and multicast do not exist natively, promiscuous mode reveals
nothing, and ARP is answered by the platform rather than by peers. Clustering software that discovers
members by broadcast, or that relies on gratuitous ARP to move a virtual IP, does not work unaltered.
The supported equivalents are a transit gateway multicast domain or an overlay you run yourself, and
address failover is performed by reassigning a secondary address through the API, which is an
authorised control-plane call rather than a data-plane trick.</p>

<h2>Security group rule evaluation and its real limits</h2>
<p>Rules are compiled into per-interface filters, so the practical limits are on rules per interface
rather than on groups in the account, and a group referenced by another group expands to the current
membership at evaluation time rather than being flattened once. That is what makes group-to-group
references stable under autoscaling. The cost appears at scale: very large referenced groups increase
the size of the compiled rule set on every interface that references them, and accounts with deeply
nested references can meet an interface limit long before any documented group limit.</p>

<h2>Connection tracking is stateful and therefore finite</h2>
<p>Statefulness implies a connection tracking table per interface, sized relative to the instance type.
Exhausting it degrades new connection establishment while existing connections continue, which
presents as rising latency on connection setup with no CPU signal at all. Rules that allow all traffic
in both directions for a protocol are handled untracked, which is the one case where a broader rule
consumes fewer resources than a narrow one, and it is the correct optimisation for very high
connection rate workloads that are protected elsewhere.</p>

<h2>What the guidance commonly gets wrong</h2>
<ul>
<li><strong>"Use network ACLs for defence in depth."</strong> As stated this adds an asymmetric failure
mode with almost no additional protection, because the ACL cannot express anything a security group
cannot except a deny. Use them for denies, and leave them permissive otherwise.</li>
<li><strong>"Private subnets are secure."</strong> They are unreachable from the internet, which is not
the same claim. Lateral movement within a VPC is governed entirely by security groups, and the local
route guarantees the path exists.</li>
<li><strong>"A /16 per VPC is wasteful."</strong> Private address space is not scarce, and the cost
of a re-address after peering has been established is measured in project quarters.</li>
<li><strong>"Endpoints are a cost optimisation."</strong> They are primarily a data path control: with
an endpoint policy and a bucket condition on the source endpoint, you can make a bucket unreadable from
anywhere except your own network, which no amount of NAT configuration achieves.</li>
</ul>
`,
    },
    questions: [
      {
        n: 1,
        question: "How many usable host addresses does a 10.0.4.0/24 subnet provide in a VPC?",
        options: [
          "256, since a /24 has 256 addresses and all are assignable.",
          "254, following the usual convention of reserving the network and broadcast addresses.",
          "251, because AWS reserves five addresses in every subnet.",
          "250, because AWS reserves the first and last three addresses.",
        ],
        answer: 2,
        explanation:
          "A /24 contains 256 addresses and AWS reserves five of them in every subnet: the network address, the VPC router, DNS, one held for future use, and the broadcast address. That leaves 251. Answering 254 applies the classic on-premises convention, which undercounts by three and is exactly the sort of drift that turns a capacity plan into a failed scaling event.",
        difficulty: "Easy",
        skill: "CIDR planning",
      },
      {
        n: 2,
        question:
          "Two teams each built a VPC using 10.0.0.0/16. They now need the services in each to call the other. What is the situation?",
        options: [
          "Peer the two VPCs and add routes on both sides; overlapping ranges are handled automatically.",
          "The VPCs cannot be peered because their CIDRs overlap, so one must be re-addressed or the traffic must pass through address translation.",
          "Peering works, but only for traffic initiated from the VPC created first.",
          "Add a more specific route in each VPC pointing at the other, which resolves the overlap.",
        ],
        answer: 1,
        explanation:
          "Peering requires non-overlapping CIDRs, because a router presented with the same prefix locally and remotely has no way to decide which side a packet belongs to. More specific routes cannot help, since the local route for the VPC CIDR always exists and cannot be removed. The only real options are re-addressing one side or interposing translation, which is why organisation-wide address planning is done before the first VPC is created.",
        difficulty: "Medium",
        skill: "CIDR planning",
      },
      {
        n: 3,
        question: "What makes a subnet public?",
        options: [
          "Setting the subnet's public flag when creating it.",
          "Assigning public IP addresses to the instances inside it.",
          "Its associated route table contains a route to an internet gateway.",
          "Attaching an internet gateway to the VPC that contains it.",
        ],
        answer: 2,
        explanation:
          "Public and private are properties of routing: a subnet is public precisely when its route table sends traffic to an internet gateway. Assigning public IPs is necessary for inbound reachability but not sufficient, and an instance with a public IP in a subnet lacking that route is unreachable and cannot reach out, which is a confusing state to debug because everything about the instance looks correct.",
        difficulty: "Easy",
        skill: "Public and private subnets",
      },
      {
        n: 4,
        question:
          "Application servers in private subnets need to download packages from the internet but must not be reachable from it. What is the correct arrangement?",
        options: [
          "Give each server a public IP address and restrict inbound traffic with a security group.",
          "Route the private subnets' default traffic to a NAT gateway placed in a public subnet.",
          "Route the private subnets' default traffic directly to the internet gateway, which allows outbound only.",
          "Place a NAT gateway in each private subnet and route the default route to it.",
        ],
        answer: 1,
        explanation:
          "A NAT gateway lives in a public subnet and translates outbound traffic from private subnets, providing egress with no inbound path. Routing a private subnet straight at the internet gateway does not work as described: that route is what makes a subnet public, and the gateway does not perform outbound-only translation. Placing the NAT gateway in the private subnet is self-defeating, since it needs its own route to the internet gateway to function.",
        difficulty: "Medium",
        skill: "Route tables and gateways",
      },
      {
        n: 5,
        question:
          "A security group on a web server allows inbound TCP 443 from 0.0.0.0/0 and has no outbound rules other than the default. Can it serve HTTPS responses?",
        options: [
          "No, an outbound rule allowing the ephemeral port range must be added.",
          "Yes, because security groups are stateful and the response to an allowed inbound connection is permitted automatically.",
          "No, because the default outbound rule only permits traffic within the VPC.",
          "Yes, but only for clients inside the same VPC.",
        ],
        answer: 1,
        explanation:
          "Security groups track connection state, so the return traffic for an allowed inbound flow is permitted regardless of outbound rules. Adding an ephemeral range outbound rule is the instinct carried over from stateless firewalls; it is unnecessary here and, applied to a network ACL, would be exactly right, which is why the two are so often confused.",
        difficulty: "Medium",
        skill: "Security groups",
      },
      {
        n: 6,
        question:
          "An autoscaling application tier must reach a database on port 5432. Which rule on the database security group survives scaling and instance replacement with no maintenance?",
        options: [
          "Allow 5432 from the CIDR block of each application subnet.",
          "Allow 5432 from the private IP addresses of the current application instances.",
          "Allow 5432 from the application tier's security group as the source.",
          "Allow 5432 from 0.0.0.0/0 and rely on database authentication.",
        ],
        answer: 2,
        explanation:
          "Naming a security group as the source describes membership rather than addresses, so instances added, replaced or moved between zones are covered with no rule change. The subnet CIDR option also survives scaling and is the tempting near-miss, but it grants access to everything in those subnets, including workloads that have nothing to do with the application tier, so it is broader than intended and drifts further as the subnets fill.",
        difficulty: "Medium",
        skill: "Security groups",
      },
      {
        n: 7,
        question:
          "A custom network ACL allows inbound TCP 443 and outbound TCP 443. Clients report that connections hang. What is the most likely cause?",
        options: [
          "The security group is also blocking the traffic and both must agree.",
          "Network ACLs are stateless, so the responses leaving on high-numbered ephemeral ports are not allowed outbound.",
          "The ACL rule numbers are too high and are evaluated after the implicit deny.",
          "Outbound 443 should not be allowed, and its presence creates a routing loop.",
        ],
        answer: 1,
        explanation:
          "A server receives on 443 and replies from 443 to the client's ephemeral source port, so the outbound rule needed is the ephemeral range, not 443. Because ACLs evaluate each direction independently, the handshake starts and the response is dropped, producing a hang rather than a refusal. Suspecting the security group is reasonable but would not explain it, since a security group would have allowed the return traffic automatically once the inbound flow was permitted.",
        difficulty: "Hard",
        skill: "Network ACLs",
      },
      {
        n: 8,
        question:
          "A network ACL has rule 100 allowing all traffic from 0.0.0.0/0 and rule 200 denying all traffic from 203.0.113.0/24. What happens to traffic from 203.0.113.5?",
        options: [
          "It is denied, because deny rules always take priority over allow rules.",
          "It is allowed, because rules are evaluated in ascending number order and rule 100 matches first.",
          "It is denied, because the more specific CIDR wins regardless of rule number.",
          "It is allowed only if a security group also permits it, otherwise denied.",
        ],
        answer: 1,
        explanation:
          "Network ACL rules are evaluated in ascending numeric order and the first match decides, so a permissive low-numbered rule shadows every deny above it. Importing the security group intuition that deny beats allow, or the routing intuition that the most specific prefix wins, gives the wrong answer here: neither applies, which is why deny rules in an ACL must be numbered below the allows they are meant to override.",
        difficulty: "Medium",
        skill: "Network ACLs",
      },
      {
        n: 9,
        question:
          "Instances in private subnets read several terabytes a month from S3 through a NAT gateway. Which change removes both the NAT data processing charge for that traffic and its exposure to the public internet?",
        options: [
          "Create an interface endpoint for S3 and attach a security group to it.",
          "Create a gateway endpoint for S3 and add its prefix list route to the private subnets' route tables.",
          "Move the instances to public subnets so they reach S3 directly through the internet gateway.",
          "Enable S3 transfer acceleration on the bucket.",
        ],
        answer: 1,
        explanation:
          "A gateway endpoint installs a prefix-list route so S3 traffic leaves the VPC privately and never touches the NAT gateway, and the endpoint itself has no hourly or per-gigabyte charge. An interface endpoint would also keep the traffic private but adds hourly and data charges of its own, so at multi-terabyte volume it trades one bill for another. Moving instances to public subnets removes the NAT charge and the privacy along with it.",
        difficulty: "Medium",
        skill: "VPC endpoints",
      },
      {
        n: 10,
        question:
          "An interface endpoint for a service is created with private DNS enabled, with endpoint network interfaces in two of the VPC's six subnets. What is the likely result for workloads in the other four subnets?",
        options: [
          "They continue to use the public endpoint, since private DNS applies only to subnets containing an endpoint interface.",
          "They resolve the service name to the endpoint addresses and connect successfully via the VPC router.",
          "They resolve the service name to the endpoint addresses but may fail to connect if the endpoint security group does not permit them.",
          "They fail to resolve the service name at all and receive an NXDOMAIN response.",
        ],
        answer: 2,
        explanation:
          "Private DNS overrides the service hostname for the entire VPC, so every subnet resolves to the endpoint addresses whether or not it hosts an interface. Routing between subnets works through the local route, so the remaining variable is the endpoint's own security group, which must allow the source. The first option is the intuitive one and is wrong precisely because the DNS override is VPC-wide, which is what makes a partially deployed endpoint fail in a way that looks like a DNS success followed by a timeout.",
        difficulty: "Hard",
        skill: "VPC endpoints",
      },
    ],
  },
  5056: {
    topicId: 5056,
    title: "Compute: ECS, Lambda and when to choose which",
    summary:
      "Compare the two execution models on the properties that actually decide the choice, latency shape, concurrency, state and operational surface, and defend a decision with numbers rather than preference.",
    concepts: [
      "Execution model",
      "Cold starts and concurrency",
      "Task definitions and Fargate",
      "Cost shape and request duration",
      "State and connection handling",
      "Operational surface",
    ],
    glossary: {
      "Task definition":
        "The immutable description of a container workload on ECS: image, CPU and memory, environment, roles, logging and networking mode.",
      Fargate:
        "The serverless capacity mode for ECS, where AWS runs the underlying host and you pay for the CPU and memory a task reserves.",
      "Cold start":
        "The additional latency incurred when a request must wait for a new execution environment to be initialised before it can be handled.",
      "Provisioned concurrency":
        "Pre-initialised Lambda environments kept warm at an hourly charge, so requests routed to them skip initialisation.",
      "Reserved concurrency":
        "A cap on how many concurrent executions a function may have, which also guarantees it that share of the account limit.",
      "ECS service":
        "A controller that keeps a desired number of tasks running, replaces unhealthy ones, and registers them with a load balancer target group.",
      "Event source mapping":
        "The Lambda-side poller that reads from a queue or a stream and invokes the function, controlling batching and parallelism.",
      "RDS Proxy":
        "A managed connection pool in front of a relational database, which lets many short-lived compute environments share a small number of database connections.",
    },
    body: {
      Beginner: `
<p>Both options run your code. The difference is who decides when a copy of it exists.</p>

<h2>ECS on Fargate</h2>
<p>You package your application as a container image and describe it in a <strong>task
definition</strong>: which image, how much CPU and memory, what environment variables it needs. ECS
then keeps a number of copies running continuously, restarts any that fail, and puts a load balancer
in front of them. The copies exist whether or not anyone is using the application.</p>

<h2>Lambda</h2>
<p>You upload a function. Nothing runs until a request arrives. When one does, AWS starts an
environment, runs your function, and keeps that environment for a while in case another request
follows. Ten simultaneous requests produce ten environments, each handling exactly one request at a
time.</p>

<h2>What actually differs</h2>
<ul>
<li><strong>Idle cost.</strong> A Fargate task costs money while it waits. A Lambda function that is
not invoked costs nothing.</li>
<li><strong>First-request latency.</strong> A warm Lambda responds immediately. One that has to start
a fresh environment adds anything from tens of milliseconds to a couple of seconds depending on the
runtime and what your initialisation code does.</li>
<li><strong>How long a request may run.</strong> Lambda has a hard ceiling measured in minutes. A
container can run for as long as you like.</li>
<li><strong>What you look after.</strong> With Lambda there are no instances, no operating system and
no scaling policy. With ECS you own a few more knobs, and you also get to keep things in memory
between requests.</li>
</ul>

<aside class="tip"><p>A reasonable default: spiky, event-driven or infrequent work goes to Lambda;
steady traffic, long requests, or anything that benefits from a warm in-process cache goes to a
container. Neither is a moral position, and most real systems use both.</p></aside>

<h2>The trap worth knowing early</h2>
<p>Databases expect a small number of long-lived connections. Lambda produces many short-lived
environments, each wanting its own. Under load that can exhaust the database's connection limit while
the database itself is barely working. The fix is a connection pool that sits in front of the database,
and knowing it exists before the incident is much cheaper than discovering it during one.</p>
`,
      Intermediate: `
<p>The choice is usually presented as containers against functions. It is more useful to frame it as
who owns the concurrency model, because almost every downstream difference follows from that.</p>

<h2>Two concurrency models</h2>
<p>An ECS task is a process you control. It handles many requests at once, using whatever concurrency
your framework provides, and the number of tasks changes on a scaling policy that reacts to a metric
over a period of a minute or more. A Lambda invocation handles exactly one event, and the platform
creates as many environments as there are simultaneous events, subject to an account limit and any
reserved concurrency you set.</p>
<p>That single fact explains most of the rest. In-process caching works in a container and is
unreliable in a function, because you cannot predict which environment serves a request. Connection
pooling works in a container and inverts in a function, where a thousand concurrent invocations mean a
thousand pools of one. Backpressure in a container is natural, since a saturated process queues; in a
function the platform simply creates more environments until it hits a limit, and the pressure lands
on whatever the function calls.</p>

<h2>Latency shape</h2>
<p>Warm invocation overhead is small. Cold start cost is dominated by initialisation: runtime startup,
dependency loading, client construction, and any VPC-attached networking setup. A function that opens
its database connection and constructs its clients at module scope pays that once per environment
rather than once per request, which is the single most effective optimisation available. Provisioned
concurrency removes cold starts for a fixed number of environments at an hourly cost, which reverses
the usual pay-per-use argument and should be justified by a latency requirement rather than applied by
default.</p>
<p>Containers have no cold start per request, but they have one per deployment and per scale-out
event. If your application takes ninety seconds to become ready, a traffic spike that needs new tasks
is served by the existing ones for ninety seconds, so container startup time is a capacity concern
even though it is invisible in steady state.</p>

<h2>Cost shape</h2>
<p>Fargate bills for reserved CPU and memory for the lifetime of the task, so cost tracks provisioned
capacity and utilisation is your problem. Lambda bills per request and per gigabyte-second of actual
execution, so cost tracks work performed. The crossover is a utilisation question: continuous traffic
at reasonable utilisation is cheaper on containers, and bursty or low-duty-cycle traffic is cheaper on
functions, sometimes by more than an order of magnitude in either direction.</p>
<p>Memory is the confusing dial on Lambda. It allocates CPU proportionally, so raising memory can lower
total cost when the function is compute-bound, because the duration falls faster than the per-unit
price rises. This is worth measuring rather than assuming, and it is measurable in minutes.</p>

<h2>Task definitions and immutability</h2>
<p>A task definition is versioned and immutable. A deployment registers a new revision and updates the
service to point at it, which makes rollback a matter of pointing back at the previous revision. Keep
configuration that varies by environment in parameters resolved at task start, and keep the image
digest pinned in the revision so that what you tested is what runs.</p>

<aside class="tip"><p>Decide with two numbers: requests per second and the ninety-fifth percentile
duration. Their product is the average concurrency you need. If that number is comfortably above one
for most of the day, a container is likely both cheaper and simpler. If it is far below one, or spikes
by two orders of magnitude, functions fit better.</p></aside>
`,
      Advanced: `
<p>The comparison gets sharper at the edges: what happens under sustained overload, what happens during
deployment, and what happens when a downstream dependency slows down. Both models fail, differently.</p>

<h2>Overload behaviour</h2>
<p>An ECS service under overload queues inside each task. Latency rises, the load balancer's surge
queue fills, and eventually requests are rejected at the balancer. The failure is gradual and visible
in latency well before it becomes errors, which gives an autoscaling policy time to act.</p>
<p>Lambda under overload scales concurrency until it meets the account limit or the function's reserved
concurrency, then throttles. For a synchronous invocation that is an immediate error to the caller; for
an asynchronous one it is a retry with backoff and eventually the dead letter destination; for a stream
source it is head-of-line blocking on the affected shard. These are three genuinely different failure
modes from one throttle, and confusing them makes incident analysis considerably harder.</p>

<h2>The account concurrency limit is shared</h2>
<p>Every function in an account draws from one concurrency pool. A misbehaving batch function can
therefore throttle a latency-sensitive API function that has nothing to do with it. Reserved
concurrency is the isolation primitive: it caps the noisy function and simultaneously guarantees the
important one its share. Accounts that run mixed workloads without any reservation have a shared fate
they have not acknowledged.</p>

<h2>Connections, and why proxies exist</h2>
<p>Relational databases allocate a non-trivial amount of memory per connection and degrade sharply past
a few hundred. A container fleet naturally holds a bounded pool. A function fleet at a thousand
concurrent invocations holds a thousand connections, each used for a few milliseconds. RDS Proxy
multiplexes those onto a small backend pool, which restores the container-like profile, but it
introduces its own considerations: pinning when a session sets state that cannot be shared, and an
extra hop of latency. Designing the function to be stateless at the session level, avoiding temporary
tables and session variables, is what keeps multiplexing effective.</p>

<h2>Deployment surface</h2>
<ul>
<li><strong>ECS</strong> deploys by replacing tasks under a deployment configuration, with health
checks, minimum healthy percent and a circuit breaker that can roll back automatically. The unit of
rollback is a task definition revision.</li>
<li><strong>Lambda</strong> deploys a new version and shifts an alias, which supports weighted traffic
shifting with an alarm-driven rollback. The unit is a version, and because versions are immutable the
rollback is instantaneous.</li>
</ul>
<p>Lambda's version alias mechanism is genuinely simpler for canaries. ECS gives more control over the
health definition. Neither difference is usually decisive on its own, but the Lambda model removes an
entire class of partially deployed state.</p>

<h2>When the answer is neither purely one nor the other</h2>
<p>Long-running work invoked by an event is the common case people force into the wrong shape. A Lambda
that must finish within its time limit is the wrong home for a thirty-minute report. Put the trigger in
a function and the work in a container task launched on demand, which keeps the event-driven cost
profile without inheriting the duration ceiling.</p>

<aside class="tip"><p>Any architecture argument that does not reference the ninety-fifth percentile
duration, the concurrency at peak and the idle fraction of the day is an aesthetic argument. Those
three numbers decide it, and all three are already in your metrics.</p></aside>
`,
      Expert: `
<p>Both services are schedulers over a shared substrate, and their differences are best understood as
different placements of the isolation boundary and different owners of the queue.</p>

<h2>Isolation and initialisation</h2>
<p>Function environments are lightweight virtual machines, which is what allows per-tenant isolation at
a granularity that would be impractical with full instances. The lifecycle has three phases worth
separating: environment initialisation, function initialisation, and invocation. Only the second is
under your control, and it is billed differently from the third, which is why moving work into module
scope changes both latency and the shape of the bill. Snapshot-and-restore mechanisms cut the second
phase by restoring a memory image, and they break any code that assumed uniqueness at initialisation,
because a restored snapshot reproduces whatever seed, connection identity or cached token was captured.
Randomness and connection establishment must therefore move to a post-restore hook rather than staying
at module scope.</p>

<h2>Queue ownership determines backpressure</h2>
<p>In a container system the queue is yours: it lives in the listen backlog, the framework's worker
pool and the load balancer's surge queue, and you can shed load with your own policy. In a function
system the queue belongs to the platform and differs by invocation path, synchronous, asynchronous, or
poller-based. The consequence is that load shedding must be expressed as configuration, through
reserved concurrency, batch size, maximum concurrency per event source and maximum record age, rather
than as code. Teams that carry container instincts into functions frequently implement retry logic that
compounds with the platform's own retries, turning a downstream slowdown into a self-inflicted
amplification.</p>

<h2>Utilisation economics</h2>
<p>Fargate charges for reserved capacity, so its effective unit cost is the list price divided by
utilisation. Lambda charges for gigabyte-seconds of execution, so its effective unit cost is close to
its list price regardless of duty cycle, with per-request charges dominating for very short
invocations. The crossover therefore moves with utilisation rather than sitting at a fixed traffic
level, and a container fleet running at fifteen per cent utilisation can be more expensive per request
than functions at any volume. This is also why the sensible first optimisation for a container fleet is
almost never a smaller instance family; it is a right-sized task with a scaling policy that permits
lower minimum capacity.</p>

<h2>Claims worth retiring</h2>
<ul>
<li><strong>"Serverless does not scale for real traffic."</strong> The limits are configurable account
quotas and a burst rate, not architectural ceilings. What does not scale is a function fronting a
resource with a small fixed connection budget.</li>
<li><strong>"Cold starts make functions unsuitable for user-facing APIs."</strong> Cold start frequency
is a function of traffic shape and environment lifetime. At steady traffic the cold fraction is small,
and where it is not, provisioned concurrency converts the problem into a cost.</li>
<li><strong>"Containers give you portability."</strong> The image is portable, and the task definition,
the load balancer, the roles and the scaling policy are not. Portability lives in how much platform
behaviour your application depends on, not in the packaging format.</li>
<li><strong>"Choose one and standardise."</strong> The operational surface of running both is smaller
than the cost of forcing an event-driven workload into a fleet, or a thirty-minute job into a function.
Standardise on the deployment pipeline and the observability contract instead.</li>
</ul>
`,
    },
  },
  5057: {
    topicId: 5057,
    title: "Storage and databases: S3 and RDS",
    summary:
      "Model data on object storage without pretending it is a filesystem, choose storage classes against real access patterns, and configure an RDS instance whose backup and failover behaviour matches the recovery promise you have made.",
    concepts: [
      "Object storage semantics",
      "Storage classes and lifecycle",
      "Durability and consistency",
      "Relational storage on RDS",
      "Backups and point-in-time recovery",
      "Replicas and failover",
    ],
    glossary: {
      "Object key":
        "The full string that names an object within a bucket. There are no directories; slashes are ordinary characters that tools display as a hierarchy, and a leading portion of a key is called a prefix and is what listings, lifecycle rules and policies are scoped by.",
      "Storage class":
        "The tier an object is stored in, trading retrieval latency and minimum duration charges against a lower per-gigabyte price.",
      "Lifecycle rule":
        "A bucket rule that transitions objects between storage classes or expires them after a given age.",
      Versioning:
        "A bucket setting that retains previous versions of an object when it is overwritten or deleted, making both operations recoverable.",
      "Multi-AZ":
        "An RDS deployment with a synchronously replicated standby in another availability zone, used for automatic failover rather than for read scaling.",
      "Read replica":
        "An asynchronously replicated copy of a database that serves read traffic and can be promoted to a standalone primary manually.",
      "Point-in-time recovery":
        "Restoring a new database instance to any second within the backup retention window, using automated backups plus archived transaction logs.",
      Snapshot:
        "A manual backup of a database instance that persists independently of the retention window and of the instance itself.",
    },
    body: {
      Beginner: `
<p>Two very different storage services, used for two very different jobs. Getting the split right is
most of the design.</p>

<h2>S3 stores objects, not files</h2>
<p>You give S3 a key, which is just a string, and some bytes. That pair is an object. There are no
folders. A key like <code>invoices/2026/03/inv-88.pdf</code> only looks like a path because the console
draws slashes as folders; to S3 it is one name.</p>
<p>This has practical consequences. Renaming means copying to the new key and deleting the old one.
Changing one line inside a large object means uploading the whole object again. Listing objects with a
common prefix is fast; asking how large a "folder" is means listing everything under it.</p>

<h2>RDS runs a real database</h2>
<p>RDS is PostgreSQL or MySQL, managed. AWS handles the machine, patching, backups and failover, and
you connect with an ordinary client and write ordinary SQL. What it does not do is remove capacity
planning: you still choose an instance size and a storage type, and both can run out.</p>

<h2>Which one for what</h2>
<ul>
<li>Uploaded files, images, exports, backups, logs and anything large and mostly read: S3.</li>
<li>Anything you need to query, join, or update transactionally: RDS.</li>
<li>A common and correct pattern: store the file in S3 and store the key, size and content type as a
row in the database.</li>
</ul>

<aside class="tip"><p>Never route file downloads through your application server just to check
permissions. Check the permission, then hand the client a presigned URL that expires in a few minutes
and let S3 serve the bytes. Your server stays small and the transfer stops competing with your
requests.</p></aside>

<h2>Two settings to turn on early</h2>
<p>Turn on <strong>versioning</strong> for any bucket holding data you would miss, because it makes an
accidental overwrite or delete recoverable. And check that your database's backup retention is long
enough to notice a problem, since a mistake found on Monday is not recoverable from a backup window
that ended on Saturday.</p>
`,
      Intermediate: `
<p>Both services are simple to start with and have a small number of properties that decide whether
they behave well at size. Those properties are worth knowing before the data grows rather than after.</p>

<h2>Keys, prefixes and access patterns</h2>
<p>An object key is the only index S3 gives you. Listing is lexicographic and prefix-scoped, so the key
layout determines which questions are cheap. Time-ordered prefixes such as
<code>events/2026/03/14/</code> make a day's data trivially listable and a per-customer query
impossible; customer-first prefixes invert that. Where both matter, the answer is not a cleverer key,
it is an index elsewhere, typically rows in a database that record the keys.</p>
<p>Objects are immutable in place. There is no append, no partial write and no rename. Multipart upload
splits a large upload into parts for throughput and resumability, but the result is still a single new
object. Designs that want to append should write many small objects and compact them periodically,
which is exactly what analytics table formats do.</p>

<h2>Storage classes are a bet on access</h2>
<ul>
<li><strong>Standard</strong> for active data.</li>
<li><strong>Standard-Infrequent Access</strong> for data read occasionally, with a lower storage price,
a per-retrieval charge and a thirty day minimum duration.</li>
<li><strong>Glacier tiers</strong> for archives, with retrieval measured in minutes to hours and
minimum durations of ninety days or more.</li>
<li><strong>Intelligent-Tiering</strong> when the pattern is genuinely unknown, which moves objects
automatically for a small monitoring charge per object.</li>
</ul>
<p>The minimum duration charges are what catch people out. Transitioning objects to an archive class
and deleting them a week later costs more than leaving them in Standard, and a lifecycle rule applied
to millions of tiny objects can cost more in transition requests than it saves in storage.</p>

<h2>Durability is not availability, and neither is backup</h2>
<p>The famous durability figure describes the probability of losing an object to hardware failure. It
says nothing about a process that overwrites the object with an empty file, or a script that deletes a
prefix. Versioning is what covers those, and combining it with a lifecycle rule that expires
noncurrent versions after a sensible period keeps the cost bounded. For genuinely important data, add
replication to a second bucket, ideally in another account, so that a credential compromise in one
account does not reach both copies.</p>

<h2>RDS: the settings that decide behaviour</h2>
<p>Multi-AZ maintains a synchronous standby in another availability zone and fails over automatically,
typically in a minute or two, by moving the DNS endpoint. The standby is not readable; it exists for
availability, not for capacity. Read replicas are asynchronous, serve read traffic, and can be promoted
manually, which makes them a scaling tool and a weak disaster recovery tool, since promotion loses
whatever had not replicated.</p>
<p>Automated backups plus archived transaction logs give point-in-time recovery to any second within
the retention window, and recovery always creates a new instance rather than rewinding the existing
one. Manual snapshots persist beyond the retention window and beyond the life of the instance, which
matters because deleting an instance deletes its automated backups.</p>

<aside class="tip"><p>Always connect through the endpoint hostname and never cache the resolved
address. Failover works by repointing DNS, so an application holding the old IP will keep trying to
reach a machine that is no longer the primary, which turns a two minute failover into an outage that
lasts until someone restarts it.</p></aside>
`,
      Advanced: `
<p>The failures that reach an incident review are rarely about the services being unavailable. They are
about assumptions: that a copy exists, that a replica is current, that a lifecycle rule did what its
name suggested.</p>

<h2>Consistency at the edges</h2>
<p>Reads of an object are strongly consistent after a write, including listings, so the classic
read-after-write race no longer applies. What remains eventual is everything built on top:
cross-region replication is asynchronous with no ordering guarantee across objects, and there is no
transaction spanning two objects. A workflow that writes a data object and then a marker object, and
whose reader treats the marker as proof the data is complete, is correct in one region and unsound
across regions.</p>

<h2>Deleting is not deleting</h2>
<p>On a versioned bucket, a delete writes a delete marker and the data remains, still billed. Teams
frequently enable versioning for safety, never expire noncurrent versions, and discover a bucket whose
billed size is several times its visible size. The complete configuration is versioning plus a
lifecycle rule expiring noncurrent versions plus a rule cleaning up incomplete multipart uploads, the
last of which is invisible in every ordinary listing and accumulates silently for years.</p>

<h2>Storage on RDS is a performance surface</h2>
<p>General purpose volumes deliver a baseline throughput and IOPS tied to size on older generations,
and configurable independently on gp3. Running out of IO credit on a burst-based volume produces a
sudden and total collapse in throughput that looks like a database problem and is a storage problem.
Storage autoscaling protects against running out of space and does nothing about IO. Watch queue depth
and read and write latency rather than utilisation percentages, because a volume at moderate
utilisation with a deep queue is already the bottleneck.</p>

<h2>Failover is not free of consequences</h2>
<ul>
<li><strong>Connections drop.</strong> Every in-flight transaction is lost and every pooled connection
is invalid. Applications need retry logic that reconnects rather than reusing a dead pool.</li>
<li><strong>The cache is cold.</strong> The promoted standby has an empty buffer pool, so the first
minutes after failover show high read latency that is not a fault.</li>
<li><strong>Replica lag decides data loss on promotion.</strong> Multi-AZ is synchronous and loses
nothing; promoting an asynchronous read replica loses whatever was in flight, and that lag is
proportional to write volume at the moment of failure, which is exactly when it is largest.</li>
</ul>

<h2>Restores are slower than snapshots suggest</h2>
<p>A restored instance is created from the snapshot and then lazily loads blocks from S3 on first
access, so the instance appears ready long before it performs like the original. A recovery time
objective validated by measuring how quickly the instance becomes available is measuring the wrong
thing. The only honest test is a rehearsed restore with the workload pointed at it, and the number it
produces is usually several times the estimate.</p>

<aside class="tip"><p>Write down the recovery point and recovery time you are actually promising, then
check that the configuration produces them. A daily backup with a seven day retention promises up to
twenty four hours of data loss, whatever the architecture diagram implies.</p></aside>
`,
      Expert: `
<p>Both services are distributed systems with published contracts, and most surprising behaviour is a
consequence of the contract rather than a defect. Reading them as such makes capacity and correctness
arguments tractable.</p>

<h2>Partitioning is automatic and not instantaneous</h2>
<p>Request rate scales with key prefix because the index is partitioned by key range and splits as load
grows. The split is reactive, so a workload that ramps abruptly against a narrow key range can meet
slow-down responses until the partitions adapt. Randomising the leading characters of the key was the
historical remedy and is now generally unnecessary, but two properties still hold: sustained throughput
is a function of prefix distribution, and a sudden step change in request rate against a cold key range
will be throttled before it is accommodated. Exponential backoff on slow-down responses is therefore
part of correctness, not politeness.</p>

<h2>Conditional writes replace the transaction you do not have</h2>
<p>Object storage offers no multi-object atomicity, so consistency across objects must be built from a
single-object primitive. Conditional put based on the current entity tag gives compare-and-swap on one
key, which is enough to implement a lease, a pointer to an immutable manifest, or an optimistic commit
protocol. Modern table formats over object storage are exactly this: immutable data files plus an
atomically swapped pointer. Designs that instead coordinate through a listing operation are relying on
an ordering guarantee that does not exist.</p>

<h2>Multi-AZ has two implementations with different semantics</h2>
<p>The traditional deployment replicates at the storage layer to a standby that is not open, so failover
requires recovery of the standby and takes on the order of a minute. The cluster deployment maintains
two readable standbys and applies changes with a quorum commit, which shortens failover and adds read
capacity, at the cost of a different write path and a different failure surface. Treating them as one
feature produces wrong estimates for both recovery time and read scaling, and they are not
interchangeable in a disaster recovery plan.</p>

<h2>Where the guidance is misleading</h2>
<ul>
<li><strong>"Eleven nines of durability means the data is safe."</strong> It bounds hardware loss only.
Every large data loss incident in practice is authorised deletion or overwrite, which durability does
not address and versioning with object lock does.</li>
<li><strong>"Read replicas improve availability."</strong> They improve read capacity. Promotion is
manual, lossy and requires reconfiguring writers, so a replica is a recovery option rather than a
recovery mechanism.</li>
<li><strong>"Lifecycle rules reduce cost."</strong> They change the cost structure. With minimum
duration charges, per-object monitoring fees and transition request pricing, a rule applied to many
small short-lived objects reliably increases the bill.</li>
<li><strong>"Encryption at rest is a compliance checkbox."</strong> The key policy is the real access
control, and a bucket policy alone does not govern a customer managed key. The interesting question is
who can decrypt, not whether the bytes are encrypted.</li>
</ul>
`,
    },
    questions: [
      {
        n: 1,
        question:
          "An application needs to rename an object from reports/draft.pdf to reports/final.pdf. What actually happens?",
        options: [
          "S3 updates the key in place, which is a metadata-only operation and costs nothing.",
          "The object is copied to the new key and the old key is deleted; there is no rename operation.",
          "S3 moves the object within its folder, which is fast because the prefix is unchanged.",
          "The object must be downloaded and re-uploaded by the client under the new key.",
        ],
        answer: 1,
        explanation:
          "There is no rename in object storage: the key is part of the object's identity, so a rename is a server-side copy followed by a delete. The metadata-only answer is tempting because the prefix has not changed, but prefixes are not folders and nothing about a shared prefix makes the operation cheaper. The copy is server-side, so the client does not need to move the bytes itself.",
        difficulty: "Easy",
        skill: "Object storage semantics",
      },
      {
        n: 2,
        question:
          "A service appends one line every few seconds to a 2 GB log object in S3. What is the problem with this design?",
        options: [
          "Nothing, provided multipart upload is used to append efficiently.",
          "S3 objects are immutable, so each append rewrites the entire object; the design should write many small objects and compact them.",
          "Nothing, provided the object is in the Standard storage class, which supports appends.",
          "S3 supports appends but charges a per-append fee that makes it expensive at this frequency.",
        ],
        answer: 1,
        explanation:
          "Objects cannot be modified in place, so every append is a full rewrite of two gigabytes for a few bytes of new data. Multipart upload is the near-miss answer: it splits a single large upload into parts for throughput and resumability, but it produces one new object and cannot add to an existing one. The workable shape is many small objects with periodic compaction, which is how log and analytics pipelines are built.",
        difficulty: "Medium",
        skill: "Object storage semantics",
      },
      {
        n: 3,
        question:
          "A lifecycle rule moves objects to an archive class after seven days. The objects are typically deleted after twenty days. What is the likely effect on cost?",
        options: [
          "Cost falls, because archive storage is significantly cheaper per gigabyte.",
          "Cost is unchanged, because the objects are deleted before any charges accrue.",
          "Cost rises, because the archive class has a minimum storage duration that is charged even after early deletion, plus transition request charges.",
          "Cost falls slightly, but retrieval becomes slower.",
        ],
        answer: 2,
        explanation:
          "Archive classes bill a minimum storage duration of ninety days or more, so deleting at twenty days still incurs the full minimum, and each transition is a billed request. The intuitive answer follows the per-gigabyte price alone and ignores both charges, which is precisely how lifecycle rules end up increasing a bill they were introduced to reduce. Lifecycle transitions only pay off when object lifetimes comfortably exceed the minimum duration.",
        difficulty: "Medium",
        skill: "Storage classes and lifecycle",
      },
      {
        n: 4,
        question:
          "A bucket holds objects whose access pattern is unpredictable: some are read constantly for years, others never again after a week. Which approach fits best?",
        options: [
          "A lifecycle rule transitioning everything to Infrequent Access after thirty days.",
          "Intelligent-Tiering, which moves objects between tiers automatically based on observed access, for a small per-object monitoring charge.",
          "Keep everything in Standard, since any rule would be wrong for half the objects.",
          "Split the bucket in two and ask the application to choose the correct one at upload time.",
        ],
        answer: 1,
        explanation:
          "Intelligent-Tiering exists for exactly this case: access is observed per object rather than assumed, and objects move back to a frequent tier at no retrieval charge if they are read again. A blanket transition rule is the tempting simple answer and is wrong for the frequently read objects, which then incur retrieval charges every time. Note the monitoring charge is per object, so a bucket of very many tiny objects is the one case where it does not pay.",
        difficulty: "Medium",
        skill: "Storage classes and lifecycle",
      },
      {
        n: 5,
        question:
          "A deployment bug overwrites 40,000 objects with empty files. Which property of the bucket determines whether the original data can be recovered?",
        options: [
          "Its durability rating, which guarantees the objects cannot be lost.",
          "Whether versioning is enabled, since the previous versions are retained on overwrite.",
          "Whether the objects were in the Standard storage class, which retains prior copies.",
          "Whether server-side encryption is enabled, which preserves the original ciphertext.",
        ],
        answer: 1,
        explanation:
          "Versioning retains the previous version when an object is overwritten, so recovery is a matter of restoring prior versions. Durability is the seductive wrong answer: it describes the probability of losing data to hardware failure and has nothing to say about a valid, authorised write that replaces good data with bad. Storage class and encryption are unrelated to retention of prior copies.",
        difficulty: "Easy",
        skill: "Durability and consistency",
      },
      {
        n: 6,
        question:
          "A pipeline writes a large data object and then writes a small marker object; a reader in another region treats the marker as proof the data is complete. What is wrong?",
        options: [
          "Nothing, because S3 provides strong read-after-write consistency for all operations.",
          "Cross-region replication is asynchronous with no ordering guarantee between objects, so the marker can arrive in the second region before the data.",
          "The reader should poll a listing instead, which is strongly consistent across regions.",
          "The marker must be written first, so that its presence can be checked before the data is written.",
        ],
        answer: 1,
        explanation:
          "Within a region reads are strongly consistent, which is why this pattern works there and lulls people into trusting it. Replication to another region is asynchronous and replicates objects independently, so a small marker frequently arrives before a large data object and the reader proceeds on incomplete data. Listings offer no additional guarantee across regions, so switching to a list does not fix it.",
        difficulty: "Hard",
        skill: "Durability and consistency",
      },
      {
        n: 7,
        question:
          "An RDS PostgreSQL instance shows normal CPU and memory but query latency has collapsed. Storage is a burst-capable general purpose volume that is 80 per cent full. What should you check first?",
        options: [
          "Whether the instance class needs upgrading, since latency is a compute symptom.",
          "Whether the volume has exhausted its IO burst credit, producing a sharp drop to baseline throughput.",
          "Whether storage autoscaling is enabled, which would resolve the latency automatically.",
          "Whether the connection count has reached max_connections, which throttles query execution.",
        ],
        answer: 1,
        explanation:
          "Burst-based volumes deliver high IOPS from a credit balance and fall to a much lower baseline when it is exhausted, which presents as a sudden latency collapse with no CPU signal at all. Upgrading the instance class is the reflex and changes nothing, because the bottleneck is the storage layer. Storage autoscaling adds capacity when space runs low and does not address IO at all.",
        difficulty: "Medium",
        skill: "Relational storage on RDS",
      },
      {
        n: 8,
        question:
          "A database instance is deleted by mistake. Backup retention was seven days and several manual snapshots exist. What can be recovered?",
        options: [
          "Both the automated backups and the manual snapshots, since deletion does not remove backups.",
          "Only the manual snapshots, because deleting an instance also deletes its automated backups.",
          "Only the automated backups, because manual snapshots are tied to the instance lifecycle.",
          "Nothing, because deletion removes all backup artefacts associated with the instance.",
        ],
        answer: 1,
        explanation:
          "Automated backups are tied to the instance and are removed when it is deleted, unless a final snapshot was taken; manual snapshots exist independently and persist. Assuming both survive is the dangerous belief here, because it makes point-in-time recovery look available when in fact the only remaining recovery points are whenever someone last took a snapshot by hand.",
        difficulty: "Medium",
        skill: "Backups and point-in-time recovery",
      },
      {
        n: 9,
        question:
          "A team wants both automatic failover and additional read capacity. Which statement is accurate?",
        options: [
          "A Multi-AZ standby provides both, since it can serve reads and take over automatically.",
          "A read replica provides both, since it can be promoted automatically when the primary fails.",
          "A traditional Multi-AZ standby is not readable and provides failover only; read capacity needs read replicas, which are promoted manually.",
          "Neither is needed, because RDS distributes reads across availability zones automatically.",
        ],
        answer: 2,
        explanation:
          "In a traditional Multi-AZ deployment the standby is not open for connections; it exists so failover can happen automatically and synchronously. Read replicas add read capacity, replicate asynchronously, and are promoted by an explicit action, so they are not a failover mechanism. Believing the standby serves reads is the most common misreading and leads teams to size the primary as though half the read load were going elsewhere.",
        difficulty: "Hard",
        skill: "Replicas and failover",
      },
      {
        n: 10,
        question:
          "After a Multi-AZ failover, an application continues to fail for thirty minutes until it is restarted. What is the most likely cause?",
        options: [
          "The failover did not complete, and the standby is still being promoted.",
          "The application resolved the endpoint once and cached the IP address, so it keeps connecting to the former primary.",
          "The new primary rejects connections until its buffer cache is warm.",
          "Failover changes the database credentials, so the application must be redeployed with new ones.",
        ],
        answer: 1,
        explanation:
          "Failover works by repointing the endpoint's DNS record, so a client that cached the resolved address keeps dialling a host that is no longer the primary until something forces re-resolution. A cold cache does slow queries after failover but does not refuse connections, and credentials are unchanged. This is why connection pools should honour DNS time to live and applications should reconnect rather than reuse a pool through a failover.",
        difficulty: "Medium",
        skill: "Replicas and failover",
      },
    ],
  },
  5058: {
    topicId: 5058,
    title: "Infrastructure as code with Terraform",
    summary:
      "Describe infrastructure as desired state, read a plan well enough to know which changes destroy something, and understand where the dependency graph and the state file come from so that drift and replacement stop being surprises.",
    concepts: [
      "Declarative desired state",
      "Resource dependency graph",
      "State and drift",
      "Plan and apply lifecycle",
      "Modules and variables",
      "Immutable replacement",
    ],
    glossary: {
      "State file":
        "Terraform's record of which real resource corresponds to each address in your configuration, along with the attribute values it last observed. It lives in a backend, normally remote object storage with a lock so two applies cannot run at once.",
      Plan: "The diff between recorded state, refreshed reality and the desired configuration, expressed as a set of create, update, replace and destroy actions.",
      "Resource address":
        "The unique name of a resource within the configuration, such as aws_s3_bucket.assets, used to link configuration to state.",
      "Implicit dependency":
        "An edge in the graph created when one resource references another's attribute, which is how ordering is normally established.",
      Module: "A reusable group of resources with declared inputs and outputs, instantiated one or more times.",
      Provider: "The plugin that translates resource definitions into API calls for a particular platform.",
      Drift: "A difference between the recorded state and the real infrastructure, caused by a change made outside Terraform.",
      "Force-new attribute":
        "An attribute that cannot be updated in place, so changing it makes the plan destroy the resource and create a replacement.",
    },
    body: {
      Beginner: `
<p>Infrastructure as code means writing down what you want to exist, rather than clicking until it
exists. The tool then works out what to do to make reality match the description.</p>

<h2>You describe the destination, not the journey</h2>
<p>You do not write "create a bucket". You write "a bucket named this, with these settings, should
exist". Run the tool once and it creates the bucket. Run it again and it does nothing, because reality
already matches. Change a setting and it changes only that setting. This property, that running the
same thing twice is the same as running it once, is what makes automation safe to repeat.</p>

<h2>The three commands</h2>
<ul>
<li><strong>init</strong> downloads the plugins for the platforms you referenced.</li>
<li><strong>plan</strong> compares what you asked for with what exists and prints exactly what it
intends to do. It changes nothing.</li>
<li><strong>apply</strong> carries out that plan.</li>
</ul>
<p>Read every plan before applying it. The output uses a small vocabulary: a plus sign for something
created, a tilde for something changed in place, a minus sign for something destroyed, and a minus
followed by a plus for something replaced. That last one is the one to slow down for.</p>

<h2>Order is worked out for you</h2>
<p>You do not number your resources. When a subnet refers to a VPC's id, the tool sees the reference
and knows the VPC must exist first. Everything with no relationship between them is created at the same
time. The order comes from the references you wrote, which is why referring to a resource is always
better than pasting an id you copied from the console.</p>

<h2>The state file</h2>
<p>The tool keeps a record connecting each name in your file to the real thing it created. Without
that record it cannot tell the difference between "this does not exist yet" and "this exists and I
should update it". Two rules follow. Keep the state somewhere shared, so your colleagues use the same
one, and never edit it by hand.</p>

<aside class="tip"><p>If a plan says a resource will be replaced, find out what that means for the
thing it represents before you continue. Replacing a security group is unremarkable. Replacing a
database means the old one is deleted and a new empty one appears.</p></aside>
`,
      Intermediate: `
<p>Terraform is a graph evaluator with a diffing engine attached. Almost everything that confuses
newcomers, ordering, replacement, drift, and the occasional apply that wants to destroy production,
becomes predictable once those two mechanisms are clear.</p>

<h2>The graph is built from references</h2>
<p>Every attribute reference between resources creates an edge, and the tool topologically sorts the
result before doing anything. Resources with no path between them are processed concurrently up to a
parallelism limit. Two consequences are worth internalising. First, ordering that you cannot express as
a reference has to be declared explicitly, which is what <code>depends_on</code> exists for, and it
should be rare, because needing it usually means a real dependency was hidden by hardcoding a value.
Second, a cycle is a configuration error rather than something to be resolved at runtime, and it is
almost always caused by two resources each referring to the other where one of the links belongs on a
separate association resource.</p>

<h2>What a plan actually compares</h2>
<p>A plan is a three-way comparison: the recorded state, the refreshed reality, and the desired
configuration. That is why a plan can propose changes even when your configuration has not been
touched. Somebody changed something in the console, refresh observed it, and the plan proposes to put
it back. That is drift, and Terraform's response to drift is always to restore the description.</p>
<p>The four actions have very different risk profiles:</p>
<ul>
<li><strong>Create</strong> and <strong>update in place</strong> are usually safe.</li>
<li><strong>Replace</strong> destroys and recreates. Whether this is trivial or catastrophic depends
entirely on what the resource is.</li>
<li><strong>Destroy</strong> in a plan you did not expect usually means a resource address changed,
because renaming a resource makes the old address disappear and the new one appear.</li>
</ul>

<h2>Force-new attributes</h2>
<p>Cloud APIs allow some attributes to be updated and not others. A provider marks the immutable ones,
and changing any of them turns an update into a replacement. The availability zone of an instance, the
name of many resources, and the engine version of some databases all behave this way. This is not
Terraform being unhelpful; it is the API declining to change something in place, and the tool being
explicit about the consequence.</p>

<h2>State, locking and the shared team problem</h2>
<p>State must be remote and locked once more than one person or pipeline runs applies. Without a lock,
two concurrent applies can both refresh, both plan against the same starting point, and both write
state, and the result is resources that exist and are not recorded anywhere. Object storage with a
lock mechanism is the standard arrangement. Treat the state as sensitive, because attribute values
including generated passwords are recorded in it.</p>

<h2>Modules and variables</h2>
<p>A module is a unit of reuse with declared inputs and outputs. The useful discipline is to keep the
interface narrow: a module with forty variables that mirror every attribute of the resources inside it
provides abstraction without simplification. Give variables types and descriptions, validate what you
can, and pass whole objects rather than long lists of scalars where the caller naturally has one.</p>

<aside class="tip"><p>Save the plan to a file and apply that file, rather than planning and then
applying separately. Otherwise the plan you read and the plan that runs are two different computations
against a world that may have changed in between.</p></aside>
`,
      Advanced: `
<p>At team scale the interesting problems are about blast radius, about state that no longer matches
the world, and about the parts of a change the plan cannot show you.</p>

<h2>Blast radius is a function of state layout</h2>
<p>Everything sharing a state file shares a lock, a refresh and a failure mode. A single state
containing the network, the databases and every application means every trivial change refreshes
hundreds of resources, waits behind every other change, and offers an apply that could touch anything.
Splitting by lifecycle rather than by team is what works: rarely-changing foundations in one state,
per-environment platform in another, applications in their own. Cross-state references should be
explicit inputs, ideally passed as values rather than by reading another state directly, so the
coupling is visible.</p>

<h2>Drift, and the honest responses to it</h2>
<p>Drift is not always vandalism. An autoscaling group's desired count changes legitimately, a service
adds a tag, a platform team fixes something during an incident. There are only three honest responses:
codify the change, ignore the attribute deliberately with a lifecycle rule, or revert it. Leaving a
plan permanently dirty is the option teams take by default, and it is the worst one, because a plan
that always shows changes trains everybody to stop reading plans.</p>

<h2>Replacement scheduling</h2>
<p>By default a replacement destroys before it creates, which produces a gap. For anything that must
remain available, <code>create_before_destroy</code> inverts the order, but it forces a constraint you
must satisfy: two copies exist simultaneously, so any globally unique attribute, a name, a port
binding, an address, will collide. This is the reason name prefixes exist in so many configurations,
and the reason a lifecycle rule alone often does not solve the problem it was reached for.</p>

<h2>What a plan cannot tell you</h2>
<ul>
<li><strong>Values known only after apply.</strong> A plan showing an unknown value cannot evaluate
anything derived from it, so the true set of changes can be larger than the plan displayed.</li>
<li><strong>Effects outside the API surface.</strong> Replacing an instance is one line in a plan and
a cache flush, a reconnection storm and a cold start in reality.</li>
<li><strong>Provider-side behaviour on update.</strong> Two resources can both show an in-place update
where one is atomic and the other is briefly unavailable during it.</li>
</ul>

<h2>Imports and moves</h2>
<p>Bringing existing infrastructure under management means importing it, and the discipline is to write
the configuration first, import, and then plan until the plan is empty. An empty plan is the proof that
your description matches reality. Renaming or restructuring resources should use move operations
expressed in configuration rather than state surgery, so the change is reviewable in the same pull
request as the code and reproducible by anyone.</p>

<aside class="tip"><p>Require a plan on every pull request and post its output on the request itself.
The review that matters is not whether the code looks reasonable but whether the actions it produces
are the ones intended, and those two questions have different answers more often than teams expect.</p></aside>
`,
      Expert: `
<p>Terraform's semantics are those of a constraint evaluator over a directed acyclic graph, with a
provider protocol that separates diffing from execution. The properties that matter operationally fall
out of that design, including the ones people describe as quirks.</p>

<h2>Plan is a partial evaluation</h2>
<p>Every value is either known at plan time or marked unknown. Unknown values propagate through
expressions, so a single computed attribute can render an entire downstream branch of the plan
indeterminate. This is why a plan on a fresh environment is far less informative than a plan on an
existing one, and why conditional logic keyed on a computed attribute produces the error about counts
depending on values that cannot be determined. The remedy is structural: the shape of the graph must
depend only on inputs known before apply, and never on results produced during it.</p>

<h2>Instance keys decide what a rename means</h2>
<p>Resources multiplied by count are addressed by integer index, and resources multiplied by for_each
are addressed by map key. Removing the second element from a list of three shifts every subsequent
index, so a plan that should have destroyed one resource destroys and recreates the tail of the
collection. With for_each the identity is the key, so removing one entry affects one resource. This is
not a style preference. It is the difference between a safe deletion and a rolling replacement of
everything after the deleted item, and it is the single most consequential authoring decision in most
configurations.</p>

<h2>The provider protocol and where responsibility sits</h2>
<p>The provider computes the diff, declares which attribute changes require replacement, and executes
the calls. Terraform core orders and schedules. Consequently a resource that is impossible to update in
place is a statement about the upstream API, and provider upgrades can legitimately change a plan for
unchanged configuration when the provider's understanding of the schema improves. Pinning provider
versions is therefore about plan stability rather than about features, and a provider upgrade deserves
its own change with its own plan review.</p>

<h2>Claims that do not hold up</h2>
<ul>
<li><strong>"The state file is a cache and can be regenerated."</strong> It carries the only mapping
between configuration addresses and real resource identifiers, and for some resources it holds
attribute values the API will never return again. Losing it means importing everything by hand.</li>
<li><strong>"Terraform is declarative, so order does not matter."</strong> Order is derived rather than
written, which is a different claim. Where the derivation is wrong because a dependency was hidden,
the apply fails intermittently and reproduces only under concurrency.</li>
<li><strong>"Modules provide isolation."</strong> They provide namespacing. Everything in one state
still shares a lock, a refresh and a failure boundary, so isolation is a property of state layout.</li>
<li><strong>"An empty plan means the infrastructure is correct."</strong> It means the managed
attributes match. Anything not modelled, anything ignored by a lifecycle rule, and anything created
outside the configuration is invisible to it.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Order the apply graph",
        difficulty: "Medium",
        statement: `
<p>Terraform does not apply resources in the order you wrote them. It builds a dependency graph from
the references between them and processes each resource only after everything it depends on has been
created.</p>
<p>You are given the resources as an array of objects:</p>
<pre>[
  { name: "aws_instance.web", needs: ["aws_subnet.a"] },
  { name: "aws_subnet.a",     needs: ["aws_vpc.main"] },
  { name: "aws_vpc.main",     needs: [] }
]</pre>
<p>Return the names in a valid apply order. The rules:</p>
<ul>
<li>A resource may be applied only once every name in its <code>needs</code> list has already been
applied.</li>
<li>When several resources are ready at the same time, take the alphabetically smallest first, so the
result is deterministic.</li>
<li>A name in <code>needs</code> that does not appear in the list refers to an existing data source
and counts as already satisfied.</li>
<li>If the dependencies form a cycle so that some resources can never be applied, return an empty
array.</li>
</ul>
<p>For the example above the answer is
<code>["aws_vpc.main", "aws_subnet.a", "aws_instance.web"]</code>.</p>
`,
        fn: "applyOrder",
        params: "resources",
        tests: [
          {
            args: [
              [
                { name: "aws_instance.web", needs: ["aws_subnet.a"] },
                { name: "aws_subnet.a", needs: ["aws_vpc.main"] },
                { name: "aws_vpc.main", needs: [] },
              ],
            ],
            expected: ["aws_vpc.main", "aws_subnet.a", "aws_instance.web"],
            label: "linear chain",
          },
          {
            args: [
              [
                { name: "aws_s3_bucket.logs", needs: [] },
                { name: "aws_kms_key.main", needs: [] },
                { name: "aws_iam_role.app", needs: [] },
              ],
            ],
            expected: ["aws_iam_role.app", "aws_kms_key.main", "aws_s3_bucket.logs"],
            label: "independent resources, alphabetical tie break",
          },
          {
            args: [[{ name: "aws_subnet.a", needs: ["data.aws_vpc.default"] }]],
            expected: ["aws_subnet.a"],
            label: "dependency on an existing data source",
          },
          {
            args: [
              [
                { name: "aws_vpc.main", needs: [] },
                { name: "aws_security_group.app", needs: ["aws_vpc.main"] },
                { name: "aws_subnet.a", needs: ["aws_vpc.main"] },
                { name: "aws_instance.web", needs: ["aws_security_group.app", "aws_subnet.a"] },
              ],
            ],
            expected: [
              "aws_vpc.main",
              "aws_security_group.app",
              "aws_subnet.a",
              "aws_instance.web",
            ],
            label: "diamond",
          },
          {
            args: [
              [
                { name: "aws_iam_role.a", needs: ["aws_iam_policy.b"] },
                { name: "aws_iam_policy.b", needs: ["aws_iam_role.a"] },
              ],
            ],
            expected: [],
            label: "cycle",
            hidden: true,
          },
          {
            args: [[]],
            expected: [],
            label: "nothing to apply",
            hidden: true,
          },
        ],
        hints: [
          "Work out which resources are ready right now, apply one, and then ask the question again. The answer changes as resources get applied.",
          "Keep a set of names that have already been applied. A resource is ready when every entry in its needs list is either in that set or is not one of the resources at all.",
          "Repeat: collect every unapplied resource that is ready, stop if there are none, otherwise sort them and take the first. If the loop stops while resources remain unapplied, the remainder is a cycle, so return an empty array.",
        ],
        solution: `function applyOrder(resources) {
  const list = Array.isArray(resources) ? resources : [];
  const managed = new Set(list.map((r) => r.name));
  const done = new Set();
  const order = [];

  while (order.length < list.length) {
    const ready = list
      .filter((r) => !done.has(r.name))
      .filter((r) => (r.needs || []).every((dep) => !managed.has(dep) || done.has(dep)))
      .map((r) => r.name)
      .sort();

    if (ready.length === 0) return [];

    const next = ready[0];
    done.add(next);
    order.push(next);
  }

  return order;
}`,
        skills: ["Resource dependency graph", "Plan and apply lifecycle"],
      },
      {
        n: 2,
        title: "Summarise the plan",
        difficulty: "Medium",
        statement: `
<p>A plan is a three-way comparison. Terraform reads the recorded state, reads the desired
configuration, and classifies every resource into one of four actions.</p>
<p>You are given the recorded state, the desired configuration and the list of attribute names that
cannot be changed in place:</p>
<pre>state  = [{ name: "aws_instance.web", attrs: { ami: "ami-1", tags: "prod" } }]
config = [{ name: "aws_instance.web", attrs: { ami: "ami-1", tags: "staging" } }]
forceNew = ["ami", "availability_zone"]</pre>
<p>Return <code>{ add, change, replace, destroy }</code>, each an alphabetically sorted array of
resource names, classified as follows:</p>
<ul>
<li><strong>add</strong>: present in the configuration and not in the state.</li>
<li><strong>destroy</strong>: present in the state and not in the configuration.</li>
<li><strong>replace</strong>: present in both, and at least one attribute that differs is named in
<code>forceNew</code>.</li>
<li><strong>change</strong>: present in both, at least one attribute differs, and none of the differing
attributes is in <code>forceNew</code>.</li>
</ul>
<p>A resource whose attributes are identical appears in none of the four lists. Compare the union of
the attribute names on both sides, so an attribute added or removed counts as a difference. Attribute
values are strings, numbers or booleans.</p>
`,
        fn: "planSummary",
        params: "state, config, forceNew",
        tests: [
          {
            args: [
              [{ name: "aws_instance.old", attrs: { ami: "ami-1" } }],
              [{ name: "aws_instance.new", attrs: { ami: "ami-1" } }],
              ["ami"],
            ],
            expected: {
              add: ["aws_instance.new"],
              change: [],
              replace: [],
              destroy: ["aws_instance.old"],
            },
            label: "basic add and destroy",
          },
          {
            args: [
              [{ name: "aws_instance.web", attrs: { ami: "ami-1", tags: "prod" } }],
              [{ name: "aws_instance.web", attrs: { ami: "ami-1", tags: "staging" } }],
              ["ami", "availability_zone"],
            ],
            expected: {
              add: [],
              change: ["aws_instance.web"],
              replace: [],
              destroy: [],
            },
            label: "in-place update",
          },
          {
            args: [
              [{ name: "aws_instance.web", attrs: { ami: "ami-1", tags: "prod" } }],
              [{ name: "aws_instance.web", attrs: { ami: "ami-2", tags: "prod" } }],
              ["ami", "availability_zone"],
            ],
            expected: {
              add: [],
              change: [],
              replace: ["aws_instance.web"],
              destroy: [],
            },
            label: "force-new attribute changed",
          },
          {
            args: [
              [{ name: "aws_s3_bucket.assets", attrs: { acl: "private", versioning: true } }],
              [{ name: "aws_s3_bucket.assets", attrs: { acl: "private", versioning: true } }],
              ["bucket"],
            ],
            expected: { add: [], change: [], replace: [], destroy: [] },
            label: "no changes",
          },
          {
            args: [
              [{ name: "aws_instance.web", attrs: { ami: "ami-1" } }],
              [{ name: "aws_instance.web", attrs: { ami: "ami-1", monitoring: true } }],
              ["ami"],
            ],
            expected: {
              add: [],
              change: ["aws_instance.web"],
              replace: [],
              destroy: [],
            },
            label: "an added attribute is a difference",
          },
          {
            args: [
              [
                { name: "aws_instance.web", attrs: { ami: "ami-1", tags: "prod" } },
                { name: "aws_db_instance.main", attrs: { size: 20 } },
                { name: "aws_iam_role.legacy", attrs: { path: "/" } },
              ],
              [
                { name: "aws_instance.web", attrs: { ami: "ami-2", tags: "staging" } },
                { name: "aws_db_instance.main", attrs: { size: 40 } },
                { name: "aws_cloudwatch_log_group.app", attrs: { retention: 30 } },
              ],
              ["ami"],
            ],
            expected: {
              add: ["aws_cloudwatch_log_group.app"],
              change: ["aws_db_instance.main"],
              replace: ["aws_instance.web"],
              destroy: ["aws_iam_role.legacy"],
            },
            label: "replacement wins over in-place",
            hidden: true,
          },
          {
            args: [[], [], []],
            expected: { add: [], change: [], replace: [], destroy: [] },
            label: "empty plan",
            hidden: true,
          },
        ],
        hints: [
          "Three of the four buckets are decided by presence alone. Only the resources that appear on both sides need their attributes inspected.",
          "Build a map from name to attributes for each side. Then a single pass over the configuration names and a single pass over the state names covers add and destroy.",
          "For a resource in both, gather the union of the attribute keys and collect the ones whose values differ. If that list is empty, the resource is unchanged; if any of its entries is in forceNew, it is a replacement; otherwise it is an in-place change. Sort all four arrays before returning.",
        ],
        solution: `function planSummary(state, config, forceNew) {
  const before = new Map((state || []).map((r) => [r.name, r.attrs || {}]));
  const after = new Map((config || []).map((r) => [r.name, r.attrs || {}]));
  const forced = new Set(forceNew || []);

  const add = [];
  const change = [];
  const replace = [];
  const destroy = [];

  for (const [name, attrs] of after) {
    if (!before.has(name)) { add.push(name); continue; }
    const prev = before.get(name);
    const keys = new Set([...Object.keys(prev), ...Object.keys(attrs)]);
    const differing = [...keys].filter((k) => prev[k] !== attrs[k]);
    if (differing.length === 0) continue;
    if (differing.some((k) => forced.has(k))) replace.push(name);
    else change.push(name);
  }

  for (const name of before.keys()) {
    if (!after.has(name)) destroy.push(name);
  }

  return {
    add: add.sort(),
    change: change.sort(),
    replace: replace.sort(),
    destroy: destroy.sort(),
  };
}`,
        skills: ["Plan and apply lifecycle", "Immutable replacement", "Declarative desired state"],
      },
    ],
  },
  5059: {
    topicId: 5059,
    title: "Pipelines, rollbacks and blue/green",
    summary:
      "Build a pipeline that promotes one tested artefact through environments, choose a deployment strategy that matches what you can actually detect, and make rollback a routine action rather than an emergency procedure.",
    concepts: [
      "Build once, promote the artefact",
      "Deployment strategies",
      "Health checks and bake time",
      "Automated rollback",
      "Migration compatibility",
      "Delivery metrics",
    ],
    glossary: {
      Artefact:
        "The immutable output of a build, identified by a digest, which is promoted unchanged through every environment rather than rebuilt per environment.",
      "Blue/green":
        "A strategy that stands up a complete second environment, shifts traffic to it, and keeps the old one available for an immediate switch back.",
      Canary:
        "A strategy that routes a small fraction of traffic to the new version and increases it only while the observed signals stay healthy.",
      "Rolling update":
        "Replacing instances a few at a time so that both versions serve traffic during the transition.",
      "Bake time":
        "The interval a new version must run under real traffic before it is considered good, long enough for slow signals to appear. A deployment circuit breaker is the rule that rolls back automatically when the version fails to become healthy within it.",
      "Expand and contract":
        "A migration technique that adds new schema in a backward compatible step, migrates readers and writers, then removes the old schema in a later release.",
      "Feature flag":
        "A runtime switch that separates deploying code from enabling behaviour, so exposure can be changed without a deployment.",
      "Change failure rate":
        "The proportion of deployments that cause a degradation requiring remediation, used with lead time as a measure of delivery health.",
    },
    body: {
      Beginner: `
<p>A pipeline is the path a change takes from your branch to production. Its job is to make that path
boring, and boring means the same steps in the same order every time, with no manual copying.</p>

<h2>Build once</h2>
<p>The most important rule is the least obvious: build the artefact one time and move that exact
artefact through every stage. Do not rebuild it for staging and rebuild it again for production. If you
rebuild, the thing you tested and the thing you released are two different things that merely came from
the same source, and any difference between them appears only in production.</p>

<h2>The usual stages</h2>
<ol>
<li>Build the artefact and give it an identity, ideally a content digest.</li>
<li>Run tests against that artefact.</li>
<li>Deploy it to a staging environment and check it works.</li>
<li>Deploy the same artefact to production.</li>
</ol>

<h2>Three ways to release it</h2>
<ul>
<li><strong>Rolling</strong>: replace the running copies a few at a time. Simple, cheap, and both
versions are live at once during the change.</li>
<li><strong>Blue/green</strong>: bring up a whole second copy of the environment, point traffic at it,
and keep the old one around. Switching back is instant.</li>
<li><strong>Canary</strong>: send a small share of traffic to the new version first and watch. If it
looks bad, stop before most users ever see it.</li>
</ul>

<h2>Rollback is a feature you build in advance</h2>
<p>Everyone plans to roll back. What decides whether you can is whether the previous version is still
around and whether the database still understands it. Keep the previous artefact available, and never
make a database change in the same release that would stop the previous version from running.</p>

<aside class="tip"><p>Deploying and releasing are two different things. A feature flag lets you deploy
code that is switched off, then turn it on for a few users without another deployment. Turning a flag
off is faster and safer than any rollback.</p></aside>

<h2>How you know it worked</h2>
<p>Not by looking at it. Define a health check the deployment system can call, give the new version a
few minutes of real traffic, and set a rule that reverses the deployment automatically if error rates
rise. A rollback that requires somebody to notice takes as long as it takes them to notice.</p>
`,
      Intermediate: `
<p>A deployment strategy is a bet about detection. You are choosing how much traffic sees a bad version
before your signals reveal it, and how quickly you can undo it. Every other property follows from
that.</p>

<h2>Promotion, not rebuilding</h2>
<p>Pin the artefact by digest and pass that digest between stages. Environment-specific values arrive
as configuration resolved at start time, not baked in. This gives you an exact chain of custody: the
digest that passed the tests is the digest running in production, and the deployment record names it.
Rebuilding per environment quietly breaks that chain, and the failure mode is always the same, a
dependency that resolved differently on the day production was built.</p>

<h2>Choosing a strategy</h2>
<ul>
<li><strong>Rolling</strong> is the default for stateless services. Its cost is a mixed-version window,
so both versions must be compatible with each other and with the data.</li>
<li><strong>Blue/green</strong> gives a clean cut and an instant reversal, at the cost of running two
full environments and having somewhere to put connections that were already open. It suits changes
where mixed versions are unacceptable.</li>
<li><strong>Canary</strong> gives the earliest detection with the smallest exposure, and requires
metrics good enough to compare two populations. Without per-version metrics a canary is just a slow
rolling deploy.</li>
</ul>

<h2>Health checks and bake time</h2>
<p>A health check that returns success as soon as the process is listening tells you the process is
listening. A useful one confirms the dependencies it needs are reachable, without failing the instance
because a non-critical downstream is slow. Distinguish liveness, which should trigger a restart, from
readiness, which should only remove an instance from rotation.</p>
<p>Bake time exists because the interesting failures are slow: a memory leak, a cache that fills, a
scheduled job that runs at the hour. Shifting from ten per cent to a hundred within two minutes tests
almost nothing. The bake interval should be long enough for at least one full cycle of the slowest
signal you rely on.</p>

<h2>Migrations decide whether rollback is possible</h2>
<p>The rule is that every release must be compatible with the one before it, in both directions, for as
long as a rollback is plausible. Expand and contract is the mechanism:</p>
<ol>
<li>Add the new column, nullable, with no reader depending on it. Deploy.</li>
<li>Write to both old and new. Backfill. Deploy.</li>
<li>Move readers to the new column. Deploy.</li>
<li>Stop writing the old column, then drop it in a later release.</li>
</ol>
<p>Four releases instead of one, and at every point the previous version still runs. A single release
that renames a column makes rollback impossible from the moment it applies, which is exactly when you
are most likely to want one.</p>

<aside class="tip"><p>Measure how long a rollback takes and rehearse it on an ordinary afternoon. A
procedure nobody has executed is a hypothesis, and the first time you test it should not be during an
incident.</p></aside>
`,
      Advanced: `
<p>The gap between a pipeline that works and one that holds up under pressure is mostly in the parts
nobody exercises: partial failures, concurrent deployments, and the assumption that stopping a
deployment undoes it.</p>

<h2>Aborting is not reverting</h2>
<p>A deployment stopped halfway leaves both versions running in unknown proportion. If the new version
has already written data the old one cannot read, stopping does not help, and neither does rolling
forward blindly. The system needs an explicit reverse action that redeploys the previous artefact and
waits for it to be healthy, and the pipeline must be able to run that action without a human assembling
it from memory.</p>

<h2>Automating the rollback decision</h2>
<p>An automatic rollback needs a signal that is fast, specific and unambiguous. Error rate and latency
at the entry point qualify. Alarms that fire for reasons unrelated to the deployment do not, because
they cause rollbacks of good versions, which teaches the team to disable the automation. Compare the
new version against the old on the same time window rather than against a fixed threshold, since
absolute thresholds are wrong at three in the morning and wrong again at peak.</p>

<h2>Traffic shifting is not instantaneous</h2>
<ul>
<li><strong>Connection draining</strong> means in-flight requests continue on the old version. Long
polling and streaming connections can persist for the whole timeout, so the mixed window is as long as
the longest connection.</li>
<li><strong>DNS-based switching</strong> is bounded by client caching, and some clients ignore time to
live entirely. Use it only where a residual tail of traffic to the old environment is acceptable.</li>
<li><strong>Load balancer target shifting</strong> is prompt and precise, which is why it is the
mechanism most blue/green implementations use underneath.</li>
</ul>

<h2>Coupling between services</h2>
<p>Independent deployability is a property of interface discipline, not of repository layout. If two
services must be deployed together in a specific order, you have a distributed monolith with the
failure modes of both. The discipline is that every change to an interface is additive first: add the
new field, support both, migrate consumers, remove the old field later. This is the same expand and
contract shape as a schema migration and it fails for the same reason when skipped.</p>

<h2>What to measure</h2>
<p>Lead time from merge to production and change failure rate together tell you whether the pipeline is
healthy. A low failure rate with a long lead time usually means fear expressed as process. A short lead
time with a high failure rate means detection is weaker than the release cadence. The improvement in
both cases is smaller changes deployed more often, which reduces the amount of new behaviour any single
rollback has to unwind.</p>

<aside class="tip"><p>Record the artefact digest, the configuration version and the deployer for every
deployment, and make that record queryable. During an incident the first useful question is what
changed and when, and answering it from chat history costs minutes you do not have.</p></aside>
`,
      Expert: `
<p>A delivery system is a control loop with a measured plant, a controller and a feedback delay. Framing
it that way makes the design constraints explicit and explains why certain pipelines oscillate or fail
to converge.</p>

<h2>Feedback delay bounds the shift schedule</h2>
<p>The controller cannot act on information it does not yet have. If the metric that would reveal a bad
release aggregates over five minutes and the alarm requires two consecutive breaching periods, the
effective delay is over ten minutes. A schedule that reaches full traffic in six minutes is therefore
operating open loop, and no amount of canary configuration recovers that. Either the shift schedule
must exceed the detection delay by a comfortable margin, or the metric must be replaced with one that
resolves faster, typically a request-level signal evaluated on a shorter window.</p>

<h2>Statistical power at low exposure</h2>
<p>Canary analysis compares two populations, and at one per cent of traffic with a baseline error rate
of a tenth of a per cent, the canary may receive too few failing requests for any difference to be
significant within the bake window. The consequence is that very small canaries detect only very large
regressions. Getting real sensitivity requires either a longer window, a larger share, or a
higher-frequency signal such as latency distribution rather than error count. Teams that set the
canary share by intuition usually pick a value with no detection power at all and derive false
confidence from it.</p>

<h2>Idempotence and the retried deployment</h2>
<p>Deployment orchestration must assume its own steps will be retried after partial completion, because
the orchestrator can fail mid-flight. Every step therefore needs a defined result when applied twice: a
target registration that already exists, a migration already applied, a flag already set. Where a step
cannot be made idempotent, it needs a durable record consulted before execution. Pipelines that
implement retries without this property fail in the most expensive way available, by half-applying a
change and then reporting success.</p>

<h2>Beliefs that do not survive scrutiny</h2>
<ul>
<li><strong>"Blue/green gives zero downtime."</strong> It gives an instant traffic cut. Sessions,
in-flight work, open connections and any shared datastore cross the boundary, and those are where the
downtime actually appears.</li>
<li><strong>"Rollback is always the safe response."</strong> Once the new version has written data in a
new format, reverting the code without reverting the data is a second incident. Safety comes from
compatibility discipline, not from the rollback button.</li>
<li><strong>"More pipeline stages mean more safety."</strong> Stages that never fail add lead time and
no information. A stage earns its place by having caught something.</li>
<li><strong>"Manual approval is a control."</strong> It is a control only if the approver has
information the automation lacks. An approval gate that shows a diff nobody can evaluate transfers
responsibility without improving the decision.</li>
</ul>
`,
    },
  },
  5060: {
    topicId: 5060,
    title: "Monitoring, alerting and on-call reality",
    summary:
      "Instrument a service with signals that answer real questions, define an objective and an error budget you can defend, and build an alert set small enough that every page is worth waking someone for.",
    concepts: [
      "Metrics, logs and traces",
      "Service level objectives",
      "Error budgets and burn rate",
      "Symptom-based alerting",
      "Cardinality and cost",
      "On-call load and runbooks",
    ],
    glossary: {
      SLI: "Service level indicator: a measured ratio of good events to valid events, such as the fraction of requests served under 300 milliseconds.",
      SLO: "Service level objective: the target value for an indicator over a stated window, such as 99.9 per cent over 30 days.",
      "Error budget":
        "The amount of failure the objective permits. At 99.9 per cent over 30 days it is roughly 43 minutes of total unavailability.",
      "Burn rate":
        "How fast the error budget is being consumed relative to the rate that would exactly exhaust it over the window. A burn rate of one exhausts it precisely on schedule.",
      Cardinality:
        "The number of distinct time series produced by a metric, equal to the product of the distinct values of all its labels.",
      "Structured log":
        "A log line emitted as key and value fields rather than free text, so it can be filtered and aggregated without regular expressions.",
      Span: "One timed operation within a trace, carrying a parent so the whole request can be reconstructed as a tree.",
      Runbook:
        "The document an on-call engineer opens when an alert fires: what it means, what the user impact is, how to confirm it and what to do.",
    },
    body: {
      Beginner: `
<p>Monitoring answers two questions. Is the service working right now, and if it is not, where should I
look. Most systems collect a great deal of data and answer neither.</p>

<h2>Three kinds of signal</h2>
<ul>
<li><strong>Metrics</strong> are numbers over time: requests per second, error count, latency. Cheap to
keep for a long time, good for spotting that something changed.</li>
<li><strong>Logs</strong> are records of individual events. Good for understanding one specific case.
Expensive if you keep everything forever.</li>
<li><strong>Traces</strong> follow one request through every service it touches. They answer the
question metrics cannot: which of the six things this request did was the slow one.</li>
</ul>

<h2>Averages lie</h2>
<p>If ninety-nine requests take 50 milliseconds and one takes ten seconds, the average is about 150
milliseconds and looks perfectly fine. The user who waited ten seconds does not care about your
average. Look at percentiles instead: the ninety-fifth percentile is the value that ninety-five per
cent of requests came in under, so it describes the experience at the slow end where the complaints
come from.</p>

<h2>Alert on what users feel</h2>
<p>It is tempting to alert on CPU being high. But high CPU with a fast, correct service is not a
problem, and it wakes someone for nothing. Alert on the symptoms users experience, requests failing or
requests being slow, and use CPU and the rest as things you look at afterwards to work out why.</p>

<aside class="tip"><p>Before you add an alert, answer two questions. What would the person receiving
it actually do, and would they be glad to be woken for it? If either answer is unclear, it belongs on a
dashboard or a ticket, not on a pager.</p></aside>

<h2>Every page needs a runbook</h2>
<p>An alert that fires at 3am with a name like "prod-alarm-7" and no further information is a puzzle,
and a puzzle is a slow way to fix an outage. Each alert should link to a short document saying what it
means, what users are experiencing, how to confirm it and what to try first. Writing that document is
also the best test of whether the alert was worth creating.</p>
`,
      Intermediate: `
<p>The useful reframing is that monitoring is not about collecting data. It is about being able to
answer a small set of questions quickly, and about waking people only when a human decision is
genuinely required.</p>

<h2>Pick the signal that fits the question</h2>
<p>Metrics are aggregates and cost the same whether one request or a million contributed, so they are
the right home for anything you want continuously and for a long time. Logs carry per-event detail and
cost in proportion to volume, so they are the right home for the exceptional case rather than the
routine one. Traces carry causality across services and are the only signal that answers where the
time went in a request that crossed four boundaries.</p>
<p>The connective tissue is a correlation identifier propagated through every hop and included in every
log line and span. Without it you have three separate systems; with it you can move from an alert to
the exact request that caused it in a couple of steps.</p>

<h2>Objectives make the argument concrete</h2>
<p>An indicator is a ratio of good events to valid events, measured as close to the user as you can
manage. An objective is a target for that ratio over a window. Once both are written down, availability
stops being a matter of opinion. Three practical points:</p>
<ul>
<li>Measure at the load balancer or the client, not inside the service, or you will exclude the
failures where the service never responded at all.</li>
<li>Define what counts as a valid event carefully. Health check traffic and requests rejected for being
malformed usually should not count against you.</li>
<li>Choose a target you would defend in a meeting about cost. Each additional nine is roughly an order
of magnitude more expensive, and 99.99 per cent is 4.3 minutes a month, which is less than one careless
deployment.</li>
</ul>

<h2>Error budgets turn availability into a quantity</h2>
<p>The budget is what the objective permits you to spend. Burn rate expresses how fast you are spending
it: a burn rate of one exhausts the budget exactly at the end of the window, and a burn rate of
fourteen consumes it in about two days. This gives a rational alerting rule. Page when a high burn rate
persists over a short window, meaning something is on fire now. Open a ticket when a modest burn rate
persists over a long window, meaning something is quietly eroding the budget. Two windows, two
severities, and no arbitrary thresholds.</p>

<h2>Cardinality is where budgets die</h2>
<p>A metric's cost is proportional to the number of distinct series it creates, which is the product of
its label values. Adding a user identifier to a request counter multiplies the series count by the
number of users. The rule is that metric labels must have bounded, low cardinality: status code, route
template, region. Anything unbounded, user id, request id, full path with parameters, belongs in a log
or a span attribute where per-event storage is expected.</p>

<aside class="tip"><p>Count your alerts and the pages they generated last month. If more than a small
fraction resulted in no action, the alert set is training people to ignore it, and the fix is deleting
alerts rather than adding documentation to them.</p></aside>
`,
      Advanced: `
<p>Mature monitoring is mostly about deletion and about honesty: fewer alerts that mean more, and
objectives that reflect what users actually experience rather than what is easy to measure.</p>

<h2>Multi-window multi-burn-rate alerting</h2>
<p>A single threshold on an error rate is either too sensitive, firing on brief blips, or too slow,
missing a fast outage. Pairing windows fixes both. A fast rule looks for a high burn rate sustained
over a short window with a shorter confirmation window to reject spikes; a slow rule looks for a lower
burn rate over hours. The fast rule detects a sudden severe failure within minutes, the slow rule
catches a persistent low-level degradation that would otherwise consume the budget invisibly, and
neither fires on a thirty second blip.</p>

<h2>Symptom, cause and the alert that should not exist</h2>
<p>Pages should be reserved for user-visible symptoms. Cause-based signals belong on dashboards where
they accelerate diagnosis. The exception worth keeping is the predictive alert with a long fuse: disk
filling in four hours, certificate expiring in a week, quota approaching its limit. These are not
symptoms, but they are actionable, unambiguous and have enough lead time to be handled without
urgency, which is exactly the profile of a good ticket-severity alert.</p>

<h2>Failure modes of the alerting system itself</h2>
<ul>
<li><strong>Alerts on absent data.</strong> When a service stops emitting entirely, a threshold on
error rate never breaches because there is no data. Configure missing data explicitly rather than
accepting the default, which frequently treats it as healthy.</li>
<li><strong>Flapping.</strong> A signal oscillating around a threshold pages repeatedly. Require a
sustained breach over several periods and use different thresholds for firing and clearing.</li>
<li><strong>Alert storms.</strong> One database failure lights up thirty dependent services. Composite
alarms and dependency-aware suppression turn that into one page describing the actual situation.</li>
<li><strong>Untested alert routing.</strong> The alarm fires correctly into a channel nobody watches.
Test the path from signal to human as deliberately as you would test a restore.</li>
</ul>

<h2>Sampling without losing the interesting requests</h2>
<p>Tracing every request is expensive at volume, and uniform random sampling keeps mostly the boring
ones. Tail-based sampling makes the decision after the request completes, so every error and every slow
request can be retained while successful fast requests are sampled at a low rate. This preserves the
population you actually investigate and cuts cost by orders of magnitude, at the price of buffering
spans until the trace ends.</p>

<h2>On-call as a measured system</h2>
<p>Track pages per shift, pages outside working hours, and the proportion that required action. Treat a
sustained rise as a defect with an owner rather than as a fact of life. The load is a product of the
alert set and the reliability of the system, and both are changeable. A rotation that regularly wakes
people for things that did not need them does not just cost sleep; it slows response to the ones that
did, because the recipient has learned that most pages can wait.</p>

<aside class="tip"><p>Review every page in a weekly rotation handover with one question: should this
have woken a human? Deleting or downgrading two alerts a week compounds quickly, and nothing else
improves on-call as reliably.</p></aside>
`,
      Expert: `
<p>Observability is the property that you can answer questions about internal state from external
outputs, including questions nobody anticipated. That is a stronger and more useful claim than having
dashboards, and it has concrete design implications.</p>

<h2>Pre-aggregation destroys the questions you have not asked</h2>
<p>A metric is a decision, made at instrumentation time, about which dimensions will ever be queryable.
Once a request counter is aggregated by status and route, no query can recover the breakdown by
customer tier, because that information was discarded before storage. Wide structured events, one
record per unit of work carrying every dimension known at completion, preserve the ability to slice
arbitrarily after the fact, at a storage cost proportional to event volume rather than to dimension
count. The practical architecture is both: bounded low-cardinality metrics for alerting and long
retention, and high-cardinality events for investigation with a shorter retention.</p>

<h2>Percentiles do not aggregate</h2>
<p>The ninety-ninth percentile of ten instances is not the average, the maximum or any other function of
their individual ninety-ninth percentiles. Computing quantiles per host and then combining them is
arithmetically meaningless, and it is a default in more systems than people expect. Correct aggregation
requires mergeable representations: histogram buckets summed across sources, or a sketch with bounded
relative error. This also constrains SLO evaluation, which must be computed from good and valid event
counts rather than from a latency percentile, precisely so that it aggregates correctly across time and
across instances.</p>

<h2>Objectives are chosen against dependencies</h2>
<p>A service composed of dependencies cannot exceed the availability implied by them on the serial path.
Four dependencies at 99.9 per cent each, all required, bound the composite at roughly 99.6 per cent
before the service contributes any failure of its own. An objective set above that bound is not
ambitious, it is arithmetically unreachable, and the honest responses are removing a dependency from
the critical path, degrading gracefully when it fails, or lowering the target. Publishing an
unattainable objective converts the error budget from a decision tool into a permanently exhausted
number that everybody ignores.</p>

<h2>Where the standard advice needs qualifying</h2>
<ul>
<li><strong>"Collect everything, decide later."</strong> Retention cost is the second largest line in
many observability bills and unbounded label cardinality is the first. Deciding later is only possible
for dimensions you chose to keep.</li>
<li><strong>"The four golden signals are sufficient."</strong> They are a good starting set for a
request-driven service. Queue-driven and batch systems need oldest-message age and completion
freshness, neither of which is expressible as latency, traffic, errors or saturation.</li>
<li><strong>"Alert fatigue is a cultural problem."</strong> It is a rate problem with a measurable
threshold. Above a few actionable pages per shift, response quality degrades regardless of the culture
around it.</li>
<li><strong>"Uptime is the metric."</strong> Uptime measures whether a process was running. The
objective should measure whether requests succeeded, and those two diverge in exactly the incidents
that matter most.</li>
</ul>
`,
    },
    questions: [
      {
        n: 1,
        question:
          "A service reports an average latency of 150 ms and users complain it is slow. What is the most likely explanation?",
        options: [
          "The average is being computed over too long a window and should be recalculated per minute.",
          "A small fraction of requests are very slow, which barely moves the mean but dominates the experience; percentiles would show it.",
          "The average is measured server side and network time should be added to it uniformly.",
          "Users are comparing against a competitor rather than an absolute standard.",
        ],
        answer: 1,
        explanation:
          "A mean is insensitive to a small tail: ninety-nine fast requests and one ten second request still average around 150 ms, while that one request is the complaint. Percentiles describe the slow end directly, which is why the ninety-fifth and ninety-ninth are the numbers to alert on. Shortening the averaging window does not help, because the tail is diluted within every window regardless of its length.",
        difficulty: "Easy",
        skill: "Metrics, logs and traces",
      },
      {
        n: 2,
        question:
          "A checkout request is intermittently slow. It calls five downstream services. Which signal identifies which call is responsible?",
        options: [
          "Metrics, by comparing the latency time series of all five services.",
          "Logs, by searching for slow queries across all five services in the same time range.",
          "Traces, because a trace records the duration of each call within a single request as a parent and child tree.",
          "Metrics on the checkout service alone, since its latency includes all downstream time.",
        ],
        answer: 2,
        explanation:
          "A trace attributes time within one specific request across service boundaries, which is exactly the question asked. Comparing five latency time series is the tempting alternative and fails for intermittent problems: aggregate curves can all look normal while a particular combination of parameters is slow, because the aggregate hides the individual request.",
        difficulty: "Medium",
        skill: "Metrics, logs and traces",
      },
      {
        n: 3,
        question:
          "Which service level indicator best reflects what users experience for an HTTP API?",
        options: [
          "The percentage of minutes in which the process was running, measured by the health check.",
          "The ratio of requests returning a non-5xx status within 300 ms to all valid requests, measured at the load balancer.",
          "The average CPU utilisation of the fleet, inverted so that lower is better.",
          "The number of successful deployments in the period divided by the number attempted.",
        ],
        answer: 1,
        explanation:
          "A good indicator is a ratio of good events to valid events measured as close to the user as possible, and measuring at the load balancer captures failures where the service never responded. Process uptime is the classic substitute and it diverges from user experience precisely during the worst incidents, when the process is running happily and returning errors to everyone.",
        difficulty: "Medium",
        skill: "Service level objectives",
      },
      {
        n: 4,
        question:
          "A team commits to 99.9 per cent availability over a 30 day window. Roughly how much total unavailability does that permit?",
        options: [
          "About 7 hours.",
          "About 43 minutes.",
          "About 4.3 minutes.",
          "About 3 hours.",
        ],
        answer: 1,
        explanation:
          "Thirty days is 43,200 minutes, and one tenth of one per cent of that is 43.2 minutes. The 4.3 minute answer is the budget for 99.99 per cent, one nine further along, and confusing the two is common because each additional nine divides the budget by ten while costing roughly an order of magnitude more to achieve.",
        difficulty: "Hard",
        skill: "Service level objectives",
      },
      {
        n: 5,
        question:
          "Why do error budget alerts commonly use two rules, a fast burn and a slow burn, rather than one threshold?",
        options: [
          "Because a single threshold cannot be applied to both latency and error rate at the same time.",
          "Because one rule must page and the other must always open a ticket, as required by incident policy.",
          "Because a single rule is either too sensitive and fires on brief spikes, or too slow and misses a rapid outage; two windows give both fast detection and resistance to noise.",
          "Because the fast rule covers business hours and the slow rule covers overnight periods.",
        ],
        answer: 2,
        explanation:
          "The two rules trade sensitivity against noise deliberately: a high burn rate over a short window catches a severe failure within minutes, and a lower burn rate over hours catches slow erosion that a short window would never accumulate. Tying the split to time of day is the plausible-sounding alternative and is wrong, since the severity should follow how fast the budget is being consumed, not the clock.",
        difficulty: "Medium",
        skill: "Error budgets and burn rate",
      },
      {
        n: 6,
        question:
          "An SLO is defined over a 30 day window. A burn rate of 14.4 sustained for one hour consumes approximately what share of the error budget?",
        options: [
          "About 0.5 per cent.",
          "About 2 per cent.",
          "About 14 per cent.",
          "About 50 per cent.",
        ],
        answer: 1,
        explanation:
          "A burn rate of one consumes the budget evenly across the window, so one hour at rate one is 1/720 of it. At 14.4 times that rate, one hour consumes 14.4/720, which is 2 per cent. Answering 14 per cent reads the burn rate as a percentage directly and ignores the window, which is why the rate must always be interpreted relative to the window length rather than as a quantity on its own.",
        difficulty: "Hard",
        skill: "Error budgets and burn rate",
      },
      {
        n: 7,
        question:
          "CPU utilisation on a fleet reaches 92 per cent while latency and error rate remain normal. Should this page an on-call engineer?",
        options: [
          "Yes, because sustained high CPU always precedes an outage.",
          "No, because CPU is a cause signal rather than a user-visible symptom; it belongs on a dashboard and in a scaling policy.",
          "Yes, but only if it stays above 90 per cent for more than one hour.",
          "No, because CPU utilisation is not a meaningful metric for containerised workloads.",
        ],
        answer: 1,
        explanation:
          "High utilisation with healthy latency and no errors means the fleet is doing its job efficiently, and paging for it wakes someone for a condition with no user impact. Cause signals accelerate diagnosis once a symptom alert has fired, which is why CPU belongs on the dashboard and in the autoscaling policy. Adding a duration qualifier does not change the reasoning: an hour of harmless high CPU is still harmless.",
        difficulty: "Medium",
        skill: "Symptom-based alerting",
      },
      {
        n: 8,
        question:
          "A team adds the authenticated user id as a label on their request counter metric. What is the consequence?",
        options: [
          "Query performance improves because the metric can be filtered per user.",
          "Nothing measurable, since labels are stored once and referenced by pointer.",
          "The number of time series multiplies by the number of distinct users, which drives storage and query cost up sharply and can break ingestion limits.",
          "The metric becomes an approximation, since labels with many values are sampled automatically.",
        ],
        answer: 2,
        explanation:
          "Series count is the product of label value counts, so an unbounded label such as a user id creates one series per user and the cost scales with your user base rather than with your traffic. The desire to filter per user is legitimate; the right home for it is a structured log field or a span attribute, where per-event storage is expected and no series explosion occurs.",
        difficulty: "Medium",
        skill: "Cardinality and cost",
      },
      {
        n: 9,
        question:
          "A monitored service crashes and stops emitting metrics entirely. An alarm on its error rate does not fire. What is the most likely reason?",
        options: [
          "The alarm's evaluation period is too short to accumulate enough samples.",
          "With no data points, the error rate threshold is never breached, and the alarm's missing data behaviour treats absence as healthy.",
          "Error rate alarms only evaluate when the service reports a non-zero request count, which is the intended behaviour.",
          "The metric was buffered and will fire once the service recovers and flushes it.",
        ],
        answer: 1,
        explanation:
          "A ratio computed from no events cannot breach a threshold, so an alarm that treats missing data as acceptable stays green through a total outage. This is the failure mode worth configuring explicitly on every alarm, usually by treating missing data as breaching or by adding a separate alarm on request volume falling to zero.",
        difficulty: "Medium",
        skill: "Symptom-based alerting",
      },
      {
        n: 10,
        question:
          "A review shows the on-call rotation received 42 pages last month, of which 6 required any action. What is the appropriate response?",
        options: [
          "Add more detail to the runbooks so the 36 non-actionable pages are faster to dismiss.",
          "Rotate on-call more frequently so the load per person falls.",
          "Delete or downgrade the alerts that produced non-actionable pages, since a mostly noisy alert set trains responders to treat every page as ignorable.",
          "Raise every threshold by 50 per cent to reduce the volume proportionally.",
        ],
        answer: 2,
        explanation:
          "An alert that never requires action has negative value: it costs attention and it slows the response to the pages that matter, because the recipient has learned that most pages can wait. Documenting them better keeps the interruption while making it slightly cheaper to dismiss, which addresses the symptom rather than the cause. Blanket threshold increases would also silence the six alerts that were doing their job.",
        difficulty: "Medium",
        skill: "On-call load and runbooks",
      },
    ],
  },
  5061: {
    topicId: 5061,
    title: "Cost: the bill as an engineering problem",
    summary:
      "Turn an opaque monthly bill into a per-request unit cost you can act on, find the handful of line items that carry most of the spend, and reduce them without pretending that turning things off is an architecture.",
    concepts: [
      "Unit economics per request",
      "Cost allocation and tagging",
      "Right-sizing and utilisation",
      "Commitment discounts",
      "Data transfer and egress",
      "Retention and lifecycle",
    ],
    glossary: {
      "Unit cost":
        "Total spend divided by a unit of business value, such as cost per thousand requests or cost per active customer, which stays comparable as traffic grows.",
      "Cost allocation tag":
        "A tag activated for billing so that spend can be grouped by service, environment or team in the cost reports.",
      "Savings Plan":
        "A commitment to a level of hourly spend for one or three years in exchange for a lower rate, applied automatically across matching usage.",
      "Reserved Instance":
        "A commitment tied to a specific resource shape, offering a discount in exchange for reduced flexibility.",
      Spot: "Spare capacity offered at a large discount that can be reclaimed with a short warning, suited to interruptible work.",
      Egress: "Data leaving a region or leaving AWS, charged per gigabyte and often the largest line nobody has attributed.",
      "Amortised cost":
        "Spend with upfront commitment payments spread over the term, which is the correct view for comparing months.",
      "Idle waste":
        "Capacity that is provisioned and billed while doing no useful work, such as non-production environments running overnight.",
    },
    body: {
      Beginner: `
<p>Cloud spend is not a finance problem that engineers report to. Every line on the bill was created by
a technical decision, so it is a technical problem with a currency attached.</p>

<h2>Look at the right number</h2>
<p>Total monthly spend rising is not by itself bad news. If traffic doubled and the bill rose by thirty
per cent, that is a success. The number worth tracking is <strong>unit cost</strong>: spend divided by
something meaningful, such as cost per thousand requests or cost per active customer. That number is
comparable month to month and tells you whether the system is getting more or less efficient.</p>

<h2>Find out where it goes before changing anything</h2>
<p>Most bills are extremely concentrated. A handful of line items usually account for the large majority
of the total, and the rest is noise. So sort the bill by service, take the top few, and ignore the rest
until those are handled. Optimising a line worth forty pounds a month is a way to feel productive
without changing anything.</p>

<h2>Tag things, or you will be guessing</h2>
<p>If resources are not tagged with an owner, an environment and a service, the report can tell you that
compute cost a lot and nothing about which team or feature caused it. Agree on a small set of tags,
apply them from the start in your infrastructure code, and activate them for billing.</p>

<h2>The four things that are usually wrong</h2>
<ul>
<li><strong>Idle non-production environments</strong> running twenty-four hours a day for a team that
works eight.</li>
<li><strong>Instances far larger than needed</strong>, chosen once during a scare and never revisited.</li>
<li><strong>Logs and backups kept forever</strong> because nobody chose a retention period.</li>
<li><strong>Data transfer</strong>, which is invisible in the architecture diagram and very visible on
the bill.</li>
</ul>

<aside class="tip"><p>Set a budget alert on day one. Not because it saves money by itself, but because
the difference between noticing a mistake on day two and noticing it when the invoice arrives is
roughly thirty times the cost of that mistake.</p></aside>
`,
      Intermediate: `
<p>The reliable method is boring: attribute the spend, find the concentration, fix the largest item,
repeat. What makes it work is doing it on unit cost rather than on totals, so growth and efficiency are
not confused with each other.</p>

<h2>Attribution before optimisation</h2>
<p>A cost report is only as good as the tags underneath it. Decide on a minimal schema, typically
service, environment, owner and cost centre, enforce it in the infrastructure code so untagged
resources cannot be created, and activate the tags for billing. Shared costs that cannot be tagged, a
NAT gateway, a cluster control plane, a load balancer serving several services, need an explicit
allocation rule. Any rule that people accept is better than leaving twenty per cent of the bill in an
unallocated bucket, because unallocated spend is spend nobody has a reason to reduce.</p>

<h2>Right-sizing is about utilisation, not size</h2>
<p>Look at the ratio of what is provisioned to what is used, over a period long enough to include the
peak. A fleet at fifteen per cent average CPU with a peak of forty is paying for capacity that never
arrives. Two distinct fixes apply and they are often confused: smaller instances reduce the cost of the
baseline, and a scaling policy with a lower minimum reduces the cost of the trough. Non-production
environments are the easiest win of all, since a schedule that stops them outside working hours removes
roughly two thirds of their cost with no architectural change.</p>

<h2>Commitments come last</h2>
<p>Commitment discounts reward you for the usage you actually keep, so committing before right-sizing
locks in the waste for one or three years. The order is: remove idle capacity, right-size what remains,
observe the stable floor for a month or two, then commit to a level below that floor. Compute Savings
Plans are usually the right instrument because they apply across instance families and regions,
preserving the flexibility to keep improving. Spot capacity is a separate lever entirely, appropriate
for interruptible batch work and for any fleet that can tolerate a two minute reclaim warning.</p>

<h2>Data transfer, the line nobody attributed</h2>
<ul>
<li><strong>Egress to the internet</strong> is charged per gigabyte, so a media-heavy application should
serve through a content delivery network where the rate is lower and the cache absorbs repeats.</li>
<li><strong>Cross-availability-zone traffic</strong> is charged in both directions. A chatty service
mesh spread across three zones can spend more moving bytes between zones than on the compute producing
them, and zone-aware routing removes most of it.</li>
<li><strong>NAT gateway processing</strong> is charged per gigabyte on top of any egress charge, which
is why gateway endpoints for S3 and DynamoDB routinely pay for themselves in the first week.</li>
</ul>

<h2>Retention is a decision, not a default</h2>
<p>Log groups with no expiry, snapshots nobody deletes, and unversioned assumptions about object storage
all accumulate silently. Set a retention period on every log group at creation, expire noncurrent object
versions, and clean up incomplete multipart uploads, which are invisible in ordinary listings and can
account for a surprising share of a bucket's billed size.</p>

<aside class="tip"><p>Put unit cost on the same dashboard as latency and error rate. A number nobody
sees weekly does not get managed, and a cost regression introduced by a deployment is much cheaper to
find in the week it happened than in the quarterly review.</p></aside>
`,
      Advanced: `
<p>Beyond the obvious savings, cost work becomes a design activity: the expensive properties of a system
are usually consequences of its architecture, and no amount of instance sizing addresses them.</p>

<h2>Cost is a distribution, not a total</h2>
<p>An aggregate cost per request hides that some requests cost a hundred times others. A single customer
running expensive queries, a rarely used endpoint that scans a whole table, an export feature that
loads everything into memory: these do not show up in an average and they determine the capacity you
provision. Attributing cost per endpoint and per customer, using request-level instrumentation joined
against resource metrics, moves the conversation from cutting spend generally to fixing the specific
paths responsible for it.</p>

<h2>Architectural choices with large cost gradients</h2>
<ul>
<li><strong>Chattiness across zone boundaries.</strong> Traffic is billed on both sides, so a design that
requires many small hops between zones pays repeatedly for the same request.</li>
<li><strong>Polling instead of events.</strong> A fleet polling a queue every second bills constantly for
the absence of work. Long polling or an event-driven trigger removes the floor entirely.</li>
<li><strong>Storing derived data.</strong> Materialised copies cost storage and cost again in the
pipeline that maintains them, and the cost is invisible when the copy was added to fix one query.</li>
<li><strong>Fan-out without deduplication.</strong> Broadcasting to consumers that discard most of what
they receive pays for delivery, processing and egress on every copy.</li>
</ul>

<h2>Commitment portfolios need managing</h2>
<p>Commitments have a term and therefore a maturity profile. Committing to your entire stable baseline in
one transaction produces a cliff where the whole portfolio expires at once, usually at a moment when
rates or your architecture have moved. Layering commitments so that a portion matures each quarter keeps
coverage high while allowing continuous adjustment. Coverage and utilisation should both be tracked:
coverage that is too low leaves discount on the table, and utilisation below a hundred per cent means
you are paying for commitment you are not consuming.</p>

<h2>Efficiency has a floor set by reliability</h2>
<p>Multi-availability-zone redundancy, spare capacity for failover and idle standby resources are not
waste. They are the price of the availability objective, and the honest way to express it is as a line
item attached to that objective rather than as inefficiency to be squeezed. Cost work that ignores this
eventually proposes removing the redundancy, which is an availability decision being made by accident in
a cost review.</p>

<h2>Detection beats periodic review</h2>
<p>Anomaly detection on the daily spend, per service and per tag, finds the accidental change within a
day: a debug logging level left on, a test that provisions a fleet and never destroys it, a lifecycle
rule deleted during a refactor. A quarterly review finds the same thing after ninety days of charges.
The detection is cheap to configure and it is the single highest return control in cost management.</p>

<aside class="tip"><p>Before any optimisation, write down the expected saving and the date you will
check it. A surprising number of changes that look obviously cheaper move cost from one line to another,
and without the check nobody notices.</p></aside>
`,
      Expert: `
<p>The mature framing is that cost is a first-class non-functional requirement with the same standing as
latency and availability, subject to the same treatment: an objective, a measurement, an owner and a
budget that constrains decisions.</p>

<h2>Marginal cost is the number that governs decisions</h2>
<p>Average cost per request answers how the business is doing. Marginal cost, the cost of the next
request, answers whether to accept it, and the two diverge sharply in systems with a large fixed
component. A platform whose fixed baseline dominates has a marginal cost close to zero, which argues for
pursuing volume; a platform whose cost is dominated by per-request egress and per-invocation charges has
marginal cost close to average, which makes pricing and capacity decisions entirely different. Deriving
which regime you are in requires separating the fixed floor from the variable slope in the bill, and it
is worth doing once properly.</p>

<h2>Discount instruments are options with a term structure</h2>
<p>A commitment is a forward purchase: you trade optionality for a lower rate, and the correct level
depends on the volatility of your baseline and on how likely your architecture is to change. The
rational commitment level is the amount of usage you are confident will persist for the term under the
worst realistic case, not the average. Where the baseline is uncertain, a shorter term at a smaller
discount is frequently the higher expected value, because the loss from committing to usage you later
eliminate exceeds the additional discount from the longer term. Treating commitment as a purchasing
exercise rather than as a portfolio decision is the usual source of stranded commitment.</p>

<h2>Pricing structure changes the optimal design</h2>
<p>Serverless components price per invocation and per gigabyte-second, so their cost is proportional to
work and their efficiency is insensitive to duty cycle. Provisioned components price per hour, so their
effective unit cost is the list rate divided by utilisation. This means the cost-optimal boundary
between the two moves with utilisation rather than with traffic volume, and it explains an outcome that
surprises people: a service can become cheaper by moving from containers to functions at low volume and
cheaper by moving back at high volume, with both migrations correct at the time.</p>

<h2>Claims that need qualifying</h2>
<ul>
<li><strong>"Reserved capacity always saves money."</strong> It saves against the usage you keep. Against
usage you eliminate, it converts a variable cost into a sunk one, which is strictly worse than having
paid on demand.</li>
<li><strong>"Serverless is more expensive at scale."</strong> True only against a well-utilised
alternative. Compared with a fleet at low utilisation it is frequently cheaper at any volume, and the
comparison is rarely made honestly because the alternative is priced at list rather than at effective
rate.</li>
<li><strong>"Storage is cheap."</strong> Per gigabyte, yes. What is not cheap is the request volume
against it, the cross-region replication of it, the egress when it is read, and the compute that scans
it because nobody chose a partitioning scheme.</li>
<li><strong>"We will optimise cost later."</strong> Data gravity, commitment terms and the retention of
data already written all make later more expensive than now. The cheap moment to choose a retention
period is before the first byte is written.</li>
</ul>
`,
    },
  },
};

export default CURRICULUM;
