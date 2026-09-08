/**
 * Course 201: Full-Stack Web Development.
 *
 * Authored curriculum for all 21 topics. Every tier teaches the same concepts to
 * a different assumed background; every coding problem is about its own topic and
 * is solvable by a pure JavaScript function, because the judge is the browser.
 */

import type { CourseCurriculum } from "./types";

const CURRICULUM: CourseCurriculum = {
  5000: {
    topicId: 5000,
    title: "The request lifecycle, end to end",
    summary:
      "Follow one click from the address bar to painted pixels, naming every hop it makes, so that when a page is slow you can say which hop is losing the time instead of guessing.",
    concepts: [
      "DNS resolution",
      "TLS handshake",
      "Request routing",
      "Caching layers",
      "Critical rendering path",
      "Time to first byte",
    ],
    glossary: {
      DNS: "The lookup that turns a hostname such as shop.example into an IP address a socket can actually connect to.",
      "TLS handshake":
        "The negotiation that agrees a cipher suite and exchanges keys before any HTTP bytes are sent, costing one or two extra round trips on a new connection.",
      "Time to first byte":
        "The gap between the request leaving the browser and the first response byte arriving, made up of network latency plus however long the server thought about it.",
      "Reverse proxy":
        "A server that terminates the client connection and forwards the request to an application process behind it, usually adding TLS, routing and caching on the way.",
      CDN: "A network of edge servers positioned near users that answers requests for cacheable assets so they never reach the origin server.",
      "Critical rendering path":
        "The smallest set of resources the browser must fetch and process before it can paint meaningful content.",
      "Round trip":
        "One complete journey of a packet to the server and back, the unit in which page latency is really measured.",
      Origin: "The scheme, host and port triple that the browser treats as one security and connection boundary.",
    },
    body: {
      Beginner: `<p>Every web page you have ever opened is the answer to a question your browser asked. You type an address, press Enter, and a short conversation happens between your machine and one that might be a thousand miles away. This lesson walks that conversation slowly, because nearly every slow page and nearly every confusing bug lives in one specific step of it.</p>
<h2>The journey in plain terms</h2>
<p>Treat the address bar as a name, not a place. Names suit people and are useless to machines, so the first job is translation. Your browser asks a directory service called <strong>DNS</strong> to turn the name into a number, and only then can it dial.</p>
<ul>
<li><strong>Look up the name.</strong> DNS turns shop.example into an address such as 203.0.113.10.</li>
<li><strong>Open the line.</strong> The browser opens a connection, and for any https address it first agrees a secret code with the server so nobody in between can read the traffic. That agreement is the <strong>TLS handshake</strong>.</li>
<li><strong>Ask the question.</strong> It sends a request: a method such as <code>GET</code>, a path such as <code>/products/42</code>, and headers describing itself.</li>
<li><strong>Get the answer.</strong> The server replies with a status code and usually some HTML.</li>
<li><strong>Draw it.</strong> The browser reads that HTML, discovers it also needs CSS, fonts and scripts, fetches those, and paints.</li>
</ul>
<aside class="tip">Each step costs a <em>round trip</em>, one journey there and back. On a phone network a round trip can be 100 milliseconds, so four of them is nearly half a second before a single pixel appears. This is why counting round trips beats counting kilobytes.</aside>
<h2>Why so many boxes</h2>
<p>Real traffic rarely reaches the application directly. A <strong>CDN</strong> sits near you and answers instantly for things that never change, like a logo. Behind it a <strong>reverse proxy</strong> decides which application should handle the path. Only then does your code run, and it may in turn ask a database. Every one of those boxes exists because someone wanted to answer faster or survive more traffic, and every one of them can also be the thing that is slow.</p>
<p>The single number worth learning first is <strong>time to first byte</strong>: how long after asking before anything at all comes back. If it is large, the problem is the network or the server, and no amount of tidying your CSS will help. If it is small but the page still feels slow, the problem is what the browser had to do after the bytes arrived.</p>`,
      Intermediate: `<p>The request lifecycle is the map every other topic in this course hangs off. When you later tune a database index, add a cache header or split a bundle, you are moving work between the stages described here.</p>
<h2>Resolution and connection</h2>
<p>Before a byte of HTTP moves, three things must happen. <strong>DNS resolution</strong> answers where to connect, and it is a cache hierarchy in its own right: the browser cache, the operating system cache, the resolver your network hands you, and finally the authoritative nameservers. A cold lookup is one or two round trips; a warm one is free. Then the transport connection is opened, which is one round trip for TCP. Then the <strong>TLS handshake</strong> negotiates a cipher suite and exchanges keys, a further round trip under TLS 1.3 and two under TLS 1.2. Only afterwards does the request line go out.</p>
<h2>Routing on the server side</h2>
<p>Arrival at the origin is not arrival at your code. A load balancer picks an instance, a reverse proxy such as nginx terminates TLS and maps the path onto an upstream, and your framework then matches the path against a route table and runs a handler. <strong>Request routing</strong> is worth reading as a chain because a 404 can be produced at any link in it, and the fix differs completely: a proxy 404 is configuration, a framework 404 is a missing route, and an application 404 is a missing row.</p>
<h2>Caching layers</h2>
<p>Between you and the origin sit several caches, and they answer in a fixed order: the browser memory and disk cache, then any shared cache such as a <strong>CDN</strong> edge, then application caches, then the database's own buffers. Response headers decide which of these are allowed to store a copy and for how long. <code>Cache-Control: public, max-age=31536000, immutable</code> on a content hashed asset is the single highest leverage line in most deployments, because it removes an entire class of requests from the network permanently.</p>
<h2>From bytes to pixels</h2>
<p>The browser streams the HTML and builds the DOM as it goes. A stylesheet in the head blocks rendering, since painting without it would produce a flash of unstyled content. A classic script in the head blocks parsing entirely, which is why <code>defer</code> and <code>type="module"</code> exist. The set of resources that must be fetched and executed before first meaningful paint is the <strong>critical rendering path</strong>, and shortening it is mostly an exercise in deleting things from the head.</p>
<aside class="tip">Split every latency number into two parts before diagnosing it. <strong>Time to first byte</strong> covers everything up to the first response byte and belongs to the network and the server. Everything after belongs to the browser, and the two are fixed by completely different work.</aside>
<h2>Where the time actually goes</h2>
<p>A typical uncached page load on a good connection spends perhaps 30 milliseconds on DNS, 40 on the connection and handshake, 120 waiting on the server, and 600 on fetching and running everything the HTML referenced. Engineers new to the field spend their effort on the first 190 milliseconds because that part is easy to name. The last 600 is where the page is really lost.</p>`,
      Advanced: `<p>Assume the sequence. The interesting part of the lifecycle is where the stages overlap, where they can be skipped, and how they degrade under real network conditions rather than on a wired desk.</p>
<h2>Connection reuse dominates</h2>
<p>The cost of <strong>DNS resolution</strong> and the <strong>TLS handshake</strong> is paid per connection, not per request, so the honest question is how many connections a page opens. HTTP/2 multiplexes all requests to one origin over a single connection, which means the second request to that origin is nearly free while the first request to a new origin costs the full setup. Every extra third party host on a page is therefore a fresh DNS lookup plus a fresh handshake, typically 150 to 250 milliseconds on mobile, paid before that host has sent anything useful. <code>preconnect</code> moves the cost earlier rather than removing it, which helps only when the connection would otherwise be opened late.</p>
<h2>Failure modes worth knowing</h2>
<ul>
<li><strong>DNS TTL versus deployment.</strong> A low TTL costs lookups; a high one means a failover takes as long as the TTL to be visible. Resolvers routinely ignore very low values.</li>
<li><strong>Handshake failure on clock skew.</strong> A device whose clock is wrong rejects a valid certificate, and the symptom presented to you is a spike in connection errors from a small set of users.</li>
<li><strong>Proxy buffering.</strong> A reverse proxy that buffers the whole response defeats streamed HTML: <strong>time to first byte</strong> becomes time to last byte, and progressive rendering silently disappears.</li>
<li><strong>Cache key mismatch.</strong> A <code>Vary</code> header on a value with high cardinality, such as <code>User-Agent</code>, fragments a shared cache into near uselessness.</li>
</ul>
<h2>Reading the waterfall properly</h2>
<p>In a network waterfall, the gap before a request even starts is usually more informative than its duration. Requests discovered late, such as a font referenced by a stylesheet that was itself discovered by a script, sit idle behind two dependencies. That chain length, not file size, is what <strong>critical rendering path</strong> optimisation attacks: preload the font, inline the small stylesheet, and the chain collapses even though the bytes are unchanged.</p>
<h2>Caching layers as an invalidation problem</h2>
<p>Adding <strong>caching layers</strong> is easy and removing stale entries is not, so choose schemes where invalidation is structural. Content hashed filenames never need purging because a new build produces a new URL. For HTML, prefer a short freshness window plus <code>stale-while-revalidate</code>, which serves the old copy instantly and refreshes in the background, over a long window plus a purge API that someone must remember to call. <strong>Request routing</strong> matters here too: if the cache key ignores a query parameter your application reads, two different pages become one cached page.</p>`,
      Expert: `<p>The lifecycle as usually taught is a serial pipeline. In production it is a partially ordered set of dependent operations across several caches with different consistency guarantees, and most of the remaining latency is structural rather than computational.</p>
<h2>Transport level realities</h2>
<p>Under HTTP/2 over TCP, multiplexing removes application level head of line blocking but not the transport level kind: one lost segment stalls every stream sharing that connection, which is why a lossy mobile link can make a multiplexed page slower than the six connection HTTP/1.1 arrangement it replaced. QUIC moves loss recovery per stream and folds the transport and cryptographic handshakes together, so a new connection settles in one round trip and a resumed one in zero. The 0-RTT path is not free of consequences: early data is replayable by an on path attacker, so it is safe only for requests you have made genuinely idempotent, and a framework that treats a <code>POST</code> as replay safe on this path has created a duplicate order bug that no test will find.</p>
<h2>What the documentation understates</h2>
<ul>
<li><strong>DNS resolution is not one lookup.</strong> Happy Eyeballs issues A and AAAA queries concurrently and races the connections, so a broken IPv6 path shows up as a fixed extra delay rather than a failure, and it will not appear in any server side metric.</li>
<li><strong>Time to first byte is not a server metric.</strong> It bundles queueing at the load balancer, connection setup and the server's own work. Without a server timing header separating them, an infrastructure regression is indistinguishable from an application one.</li>
<li><strong>Shared caches are keyed by more than the URL.</strong> Normalise the key deliberately: strip tracking parameters, sort the survivors, and vary only on values you truly branch on, usually <code>Accept-Encoding</code> and at most a coarse device class.</li>
</ul>
<h2>Streaming changes the shape of the problem</h2>
<p>Once the origin flushes the document head early, the <strong>critical rendering path</strong> stops being a sequence and becomes a scheduling problem. The browser can open connections for subresources while the server is still assembling the body, so the server's slowest query no longer delays asset discovery. This is the mechanism behind early hints and behind streamed server rendering, and it inverts a common assumption: a slower total response can produce a faster first paint if the ordering is right.</p>
<aside class="tip">Instrument the boundaries, not the middle. One trace that carries an identifier from the edge through the proxy into the handler and down to the query will answer where the time went in one look. Three unconnected dashboards will not, however detailed each of them is.</aside>
<h2>Design consequence</h2>
<p>Because the expensive stages are per connection and per dependency chain, architecture beats micro-optimisation here. Consolidating third party origins, hashing asset names so that <strong>caching layers</strong> need no invalidation, and keeping <strong>request routing</strong> shallow enough that one hop reaches the handler will each save more than any amount of tuning inside the handler itself.</p>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A page served over https opens its first connection to a brand new origin. Which sequence of costs is paid before the HTTP request line is sent?",
        options: [
          "DNS lookup, then TCP connection, then TLS handshake",
          "TLS handshake, then DNS lookup, then TCP connection",
          "TCP connection, then DNS lookup, then TLS handshake",
          "DNS lookup, then TLS handshake, then TCP connection",
        ],
        answer: 0,
        explanation:
          "The name must be resolved to an address before any socket can be opened, the transport connection must exist before keys can be exchanged over it, and only an established secure channel can carry the request. The tempting answer that puts TLS first confuses the fact that https is in the URL with the order of operations: TLS is negotiated over a connection that must already exist.",
        difficulty: "Easy",
        skill: "TLS handshake",
      },
      {
        n: 2,
        question:
          "Time to first byte for a page is 900 milliseconds on a fast connection. Which investigation is most likely to find the cause?",
        options: [
          "Reducing the size of the JavaScript bundle",
          "Inlining the stylesheet into the document head",
          "Profiling server side work such as slow queries or cold starts",
          "Converting images to a more modern format",
        ],
        answer: 2,
        explanation:
          "Time to first byte ends when the first response byte arrives, so it contains only network latency and server think time. Bundle size, image format and stylesheet placement all affect what happens after that byte, which is why shrinking the bundle is the tempting but wrong choice: it cannot move a number that has already been recorded before the bundle is even discovered.",
        difficulty: "Medium",
        skill: "Time to first byte",
      },
      {
        n: 3,
        question:
          "A team adds three analytics providers, each on its own hostname. What is the dominant cost on a mobile connection?",
        options: [
          "The extra bytes of the three scripts",
          "Three additional DNS lookups and TLS handshakes before any of them transfers data",
          "Extra memory used by the three script contexts",
          "Additional DOM nodes created by the providers",
        ],
        answer: 1,
        explanation:
          "Connection setup is paid per origin, not per request, so each new hostname costs a resolution plus a handshake, typically 150 to 250 milliseconds on mobile before a single useful byte moves. Counting bytes is the intuitive answer but understates the problem: three small scripts on three hosts are far more expensive than one larger script on a host already connected.",
        difficulty: "Medium",
        skill: "DNS resolution",
      },
      {
        n: 4,
        question:
          "Which response header pair is appropriate for a JavaScript file whose filename already contains a content hash?",
        options: [
          "Cache-Control: no-store",
          "Cache-Control: public, max-age=31536000, immutable",
          "Cache-Control: private, max-age=60",
          "Cache-Control: no-cache, must-revalidate",
        ],
        answer: 1,
        explanation:
          "A hashed filename changes whenever the content changes, so the old URL can never become stale and a one year public lifetime with immutable removes even the revalidation request. Choosing no-cache feels safe but is the wrong instinct here: it forces a conditional request on every load for a file that is guaranteed never to change.",
        difficulty: "Medium",
        skill: "Caching layers",
      },
      {
        n: 5,
        question:
          "A request returns 404, but the application logs show the handler was never invoked. Where should you look first?",
        options: [
          "The database, since the row is probably missing",
          "The reverse proxy or load balancer routing rules",
          "The browser cache, which may be holding an old response",
          "The TLS certificate chain",
        ],
        answer: 1,
        explanation:
          "Routing is a chain, and a 404 can be produced at any link in it. If no handler ran, the request never reached the framework's route table, so the decision was taken upstream in the proxy or balancer configuration. A missing database row would also produce 404, but only after the handler had run and logged.",
        difficulty: "Medium",
        skill: "Request routing",
      },
      {
        n: 6,
        question:
          "A font is referenced by a stylesheet which is itself loaded by a script. Why does preloading the font help more than compressing it?",
        options: [
          "Preloaded resources are decompressed by the browser more efficiently",
          "It shortens the discovery chain, so the fetch starts far earlier rather than finishing faster",
          "Preloading moves the font to a different connection with more bandwidth",
          "Compression does not apply to font files",
        ],
        answer: 1,
        explanation:
          "The font sits behind two dependencies, so its request cannot even begin until the script and then the stylesheet have been fetched and parsed. Preloading breaks that chain and starts the request immediately. Compression shortens the transfer, which is the smaller half of the delay when the request has not started yet.",
        difficulty: "Hard",
        skill: "Critical rendering path",
      },
      {
        n: 7,
        question:
          "A shared CDN cache suddenly has a very low hit rate after a release that added Vary: User-Agent. Why?",
        options: [
          "Vary disables caching entirely for any response that carries it",
          "User-Agent has thousands of distinct values, so the cache key fragments into near unique entries",
          "The CDN cannot parse the User-Agent header and falls back to bypass",
          "Vary is only valid on requests, not responses",
        ],
        answer: 1,
        explanation:
          "Vary adds the named request header to the cache key, and User-Agent varies by browser version, device and build, so almost every visitor generates a fresh entry that nobody else can reuse. The idea that Vary disables caching is a common misreading: it narrows reuse rather than preventing storage.",
        difficulty: "Hard",
        skill: "Caching layers",
      },
      {
        n: 8,
        question:
          "Under HTTP/2, why can a single lost network segment still delay unrelated requests on the same connection?",
        options: [
          "HTTP/2 processes requests strictly in the order they were sent",
          "TCP delivers bytes in order, so a lost segment stalls every stream multiplexed over that connection",
          "The TLS record layer discards all streams when a segment is lost",
          "HTTP/2 servers retry the whole connection on any loss",
        ],
        answer: 1,
        explanation:
          "Multiplexing removes head of line blocking at the application layer, but TCP still guarantees in order delivery underneath, so a gap in the byte stream holds back everything behind it. Believing HTTP/2 is strictly ordered at the application layer is the tempting error: streams do interleave freely, and the constraint that bites lives in the transport below them.",
        difficulty: "Hard",
        skill: "Request routing",
      },
    ],
  },

  5001: {
    topicId: 5001,
    title: "HTTP semantics that matter in practice",
    summary:
      "Learn the parts of HTTP that change how your API behaves under retries, proxies and caches: method semantics, the status codes that carry meaning, conditional requests and content negotiation.",
    concepts: [
      "Method semantics",
      "Idempotency",
      "Status code families",
      "Conditional requests",
      "Content negotiation",
      "Headers and representation metadata",
    ],
    glossary: {
      "Safe method":
        "A method that is not expected to change server state, such as GET or HEAD, which lets intermediaries fetch it speculatively.",
      Idempotent:
        "A request that can be sent more than once with the same end state as sending it once, which is what makes automatic retries safe.",
      ETag: "An opaque token identifying one version of a representation, used to make later requests conditional.",
      "412 Precondition Failed":
        "The response when a conditional header such as If-Match does not hold, which is how optimistic concurrency is signalled over HTTP.",
      "Content negotiation":
        "The mechanism by which client and server agree a representation, using Accept and related request headers against the server's available variants.",
      Representation:
        "One concrete encoding of a resource, for example the JSON form of an order as opposed to its HTML form.",
      "201 Created":
        "The success status for a request that produced a new resource, normally accompanied by a Location header pointing at it.",
    },
    body: {
      Beginner: `<p>HTTP is a small vocabulary that every browser, proxy and library already agrees on. Learning it properly means you get behaviour for free rather than inventing it yourself, and it stops a whole family of bugs that appear only when something goes wrong on the network.</p>
<h2>The verbs</h2>
<p>A request begins with a method, and the method is a promise about what the request does.</p>
<ul>
<li><code>GET</code> asks for something and changes nothing. Anyone may repeat it, cache it, or fetch it early on your behalf.</li>
<li><code>POST</code> submits something and may create a new thing. Repeating it may create a second thing.</li>
<li><code>PUT</code> replaces a thing at a known address. Sending it twice leaves exactly the same result as sending it once.</li>
<li><code>DELETE</code> removes a thing. Sending it twice also leaves it removed.</li>
</ul>
<p>That last property has a name: <strong>idempotent</strong>. It matters because networks lose replies. If your phone sends a request and the reply never comes back, the library does not know whether the server acted. If the method is idempotent it can simply try again. If it is <code>POST</code>, it cannot, and that is exactly how people get charged twice.</p>
<h2>The numbers</h2>
<p>The first digit of a status code tells you who has the problem. Two hundreds mean it worked. Three hundreds mean look somewhere else, usually a redirect. Four hundreds mean the request was wrong, so the caller must change something. Five hundreds mean the server broke, so the caller may reasonably try again later.</p>
<aside class="tip">Returning <code>200 OK</code> with a body saying <em>error: not found</em> looks harmless and is not. Caches will store it, monitoring will call it a success, and client libraries will hand it to your code as a valid result. The status line is read by machines; make it true.</aside>
<h2>Asking only if it changed</h2>
<p>When a server sends a response it can attach an <strong>ETag</strong>, a short token that identifies that exact version. Next time, the browser sends the token back and asks the server to reply only if the token has changed. If it has not, the answer is a tiny <code>304 Not Modified</code> with no body at all. You get freshness at the price of a nearly empty message.</p>`,
      Intermediate: `<p>HTTP semantics are a contract with software you did not write. Proxies, browser caches, service meshes and client libraries all act on the method and the status code, so getting them right is not pedantry, it is how you avoid inventing your own retry, cache and concurrency mechanisms badly.</p>
<h2>Method semantics as guarantees</h2>
<p>Two independent properties are in play. A method is <strong>safe</strong> if it is not expected to modify state, and <strong>idempotent</strong> if repeating it has the same effect as performing it once. <code>GET</code> and <code>HEAD</code> are both. <code>PUT</code> and <code>DELETE</code> are idempotent but not safe. <code>POST</code> is neither, and <code>PATCH</code> is not idempotent in general, since a patch document that increments a counter clearly is not.</p>
<p>The practical consequence is retries. Every serious HTTP client retries idempotent requests on a connection failure automatically, because it cannot distinguish a lost request from a lost response. If you implement a state changing operation behind <code>GET</code>, a link prefetcher or a security scanner will eventually execute it for you.</p>
<h2>Status codes that carry information</h2>
<ul>
<li><code>201 Created</code> with a <code>Location</code> header tells the client where the new resource lives, so it need not guess the URL it just caused to exist.</li>
<li><code>202 Accepted</code> is the honest answer for work queued for later, and should point at a status resource.</li>
<li><code>409 Conflict</code> means the request was well formed but contradicts current state, which is different from <code>422</code>, where the payload itself does not make sense.</li>
<li><code>429 Too Many Requests</code> with <code>Retry-After</code> lets a well behaved client back off correctly instead of hammering you.</li>
</ul>
<h2>Conditional requests</h2>
<p><strong>Conditional requests</strong> serve two distinct purposes, and confusing them is common. With <code>If-None-Match</code> on a read, the server answers <code>304 Not Modified</code> when the client's copy is still current, which saves bandwidth. With <code>If-Match</code> on a write, the server answers <code>412 Precondition Failed</code> when the resource has moved on since the client read it, which prevents a lost update. The second is optimistic concurrency control, and it is available to you at no cost because the plumbing already exists in every client.</p>
<h2>Content negotiation</h2>
<p><strong>Content negotiation</strong> lets one URL serve several representations. The client sends <code>Accept: application/json</code> and the server chooses among what it can produce, reporting the choice in <code>Content-Type</code> and telling caches about the axis of variation with <code>Vary: Accept</code>. The same mechanism drives compression through <code>Accept-Encoding</code> and language selection through <code>Accept-Language</code>.</p>
<aside class="tip">If you vary a response by anything, say so in <code>Vary</code>. A shared cache that does not know a response depended on a request header will happily serve the German page to an English speaker, and the bug will only appear behind the CDN.</aside>
<h2>Headers describe the representation, not the resource</h2>
<p><code>Content-Type</code>, <code>Content-Encoding</code>, <code>Content-Length</code> and <code>ETag</code> all describe the specific bytes in this message. That is why a gzipped and an identity encoded copy of the same document legitimately carry different ETags, and why blindly copying an ETag between variants breaks conditional requests in a way that is very hard to reproduce locally.</p>`,
      Advanced: `<p>Assume the method table and the status families. What separates a durable API from a working one is how its HTTP semantics behave when the network misbehaves and when intermediaries make decisions you did not anticipate.</p>
<h2>Idempotency is a design obligation, not a property of POST</h2>
<p>Since <code>POST</code> carries no <strong>idempotency</strong> guarantee, you must supply one for any operation whose repetition would be expensive. The accepted mechanism is a client generated key sent in a header, stored with the outcome of the first attempt, and replayed verbatim on any request bearing the same key. Three details decide whether it works: the key must be stored in the same transaction that performs the effect, a request in flight must cause a concurrent duplicate to wait or receive <code>409</code> rather than proceed, and the stored response must include the original status code. Systems that store only a key and not the response answer a legitimate retry with an unhelpful <code>200</code> and an empty body.</p>
<h2>Conditional requests under concurrency</h2>
<p>Weak and strong validators differ in a way that matters here. A weak ETag, prefixed <code>W/</code>, asserts semantic equivalence and is fine for caching but must not be used with <code>If-Match</code> for a write, because two semantically equivalent representations can differ in the field you are about to overwrite. Range requests likewise require a strong validator, since assembling a file from two different versions produces silent corruption rather than an error.</p>
<h2>Redirects and method rewriting</h2>
<ul>
<li><code>301</code> and <code>302</code> were widely implemented as rewriting the method to <code>GET</code>, which is why <code>307</code> and <code>308</code> exist to preserve it.</li>
<li>A redirect from https to http silently downgrades the request, and any credential in a header is at risk.</li>
<li>Cross origin redirects drop authorisation headers in most clients, producing a 401 that appears to come from the wrong host.</li>
</ul>
<h2>Negotiation has costs</h2>
<p><strong>Content negotiation</strong> multiplies cache entries by every axis you vary on. Negotiating format by URL suffix or by an explicit version segment keeps one representation per URL and makes the cache key trivial, at the price of losing the elegance of a single canonical address. For public APIs behind a CDN the pragmatic split is to negotiate encoding and nothing else, and to make format and version explicit in the path.</p>
<aside class="tip">Reserve <code>422</code> for a payload your validator rejected and <code>409</code> for a payload that is fine in isolation but contradicts current state, such as booking a seat someone took first. The distinction tells the client whether to fix the request or refetch and retry, and it is the difference between a useful error and a support ticket.</aside>`,
      Expert: `<p>HTTP is best read as a caching and intermediation protocol that happens to carry application data. Its semantics exist so that a party which understands nothing about your domain can still make correct decisions about a message, and most production incidents attributed to HTTP are really violations of that contract by the application.</p>
<h2>The invariants intermediaries rely on</h2>
<p>A cache is permitted to reuse a stored response for a subsequent request when the method is understood to be cacheable, the freshness lifetime has not elapsed, and the selecting headers named in <code>Vary</code> match. Nothing in that rule consults your application. Consequently an endpoint that returns a per user body under <code>GET</code> without <code>Cache-Control: private</code> is not merely inefficient, it is a data disclosure defect waiting for a shared cache to be introduced anywhere on the path, including one inside a corporate proxy you will never see.</p>
<h2>Where the specifications are commonly misread</h2>
<ul>
<li><strong>Idempotent does not mean side effect free.</strong> A <code>DELETE</code> may legitimately emit an audit record on every call. The requirement is on the observable end state, not on internal effects, which is why <strong>method semantics</strong> alone never justify retrying a request whose side effects are externally visible.</li>
<li><strong>PATCH has no defined semantics of its own.</strong> The media type supplies them. JSON Merge Patch cannot express removal from an array and cannot distinguish null from absent; JSON Patch can, at the price of a document that is order dependent and therefore not naturally idempotent.</li>
<li><strong>ETag comparison rules differ by header.</strong> <code>If-None-Match</code> uses weak comparison, <code>If-Match</code> and range preconditions use strong comparison. A server that treats them alike will either miss cache hits or permit lost updates, and only one of those is visible in a graph.</li>
<li><strong>A 404 is not a promise.</strong> It carries no assertion about whether the resource ever existed, which is precisely why it is the correct answer for a resource the caller is not authorised to know about, in preference to a <code>403</code> that confirms existence.</li>
</ul>
<h2>Negotiation, agents and the reality of Accept</h2>
<p>Quality values in <code>Accept</code> are a preference ordering the server may satisfy, not a command, and browsers send headers whose literal interpretation would be absurd. Robust servers therefore treat <strong>content negotiation</strong> as a match against a small declared variant set with a deterministic tie break, and reject unmatchable requests with <code>406</code> only where an implicit default would be dangerous. The corollary for representation metadata is that <code>Content-Type</code> must always be sent explicitly: sniffing is a security boundary problem, and <code>X-Content-Type-Options: nosniff</code> is the instruction to stop guessing.</p>
<aside class="tip">Model errors as a media type rather than as free text. A single problem document shape carrying a stable machine readable type identifier, a human readable title and any field level detail lets clients branch on the type and lets humans read the title, and it survives every future endpoint you add.</aside>
<h2>Consequence for API design</h2>
<p>Treat the status line and the header block as the public interface and the body as an implementation detail of one representation. Every guarantee you can express in <strong>status code families</strong>, <strong>conditional requests</strong> or cache directives is a guarantee enforced by software you do not maintain, in every language, at no cost. Every guarantee you invent inside the body must be reimplemented by each client that talks to you.</p>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Which pair of properties correctly describes DELETE in HTTP?",
        options: [
          "Safe and idempotent",
          "Not safe but idempotent",
          "Safe but not idempotent",
          "Neither safe nor idempotent",
        ],
        answer: 1,
        explanation:
          "DELETE clearly modifies state, so it is not safe, but repeating it leaves the resource absent exactly as one call would, so it is idempotent. Calling it neither is the common error, and it comes from assuming that a second DELETE returning 404 means the state differs, when the resulting state is identical either way.",
        difficulty: "Easy",
        skill: "Method semantics",
      },
      {
        n: 2,
        question:
          "A payment endpoint uses POST. A mobile client loses the response and retries automatically. What is the correct fix?",
        options: [
          "Change the endpoint to PUT so retries become safe",
          "Require a client supplied idempotency key stored with the outcome of the first attempt",
          "Return 200 on every duplicate so the client stops retrying",
          "Disable client retries entirely",
        ],
        answer: 1,
        explanation:
          "POST carries no idempotency guarantee, so you must supply one: the key is recorded in the same transaction as the effect and a repeat of that key replays the original outcome. Switching to PUT is tempting but only relocates the problem, since the client still has no address to put to and two clients could still create two payments.",
        difficulty: "Medium",
        skill: "Idempotency",
      },
      {
        n: 3,
        question:
          "An API returns 200 OK with a body of {\"error\": \"not found\"}. What is the most serious practical consequence?",
        options: [
          "The response body is slightly larger than necessary",
          "Caches, monitoring and client libraries all treat a failure as a success",
          "The client cannot parse the JSON",
          "It violates content negotiation rules",
        ],
        answer: 1,
        explanation:
          "The status line is the part every intermediary reads, so a 200 tells caches to store the error, dashboards to count it as healthy and client libraries to resolve rather than throw. Worrying about body size misses the point entirely: the cost is that machines act on a status that is not true.",
        difficulty: "Easy",
        skill: "Status code families",
      },
      {
        n: 4,
        question:
          "Two editors load the same document and both save. Which HTTP mechanism prevents the second save from silently overwriting the first?",
        options: [
          "Sending If-None-Match on the write and handling 304",
          "Sending If-Match with the ETag read earlier and handling 412",
          "Adding Cache-Control: no-store to the write",
          "Using PATCH instead of PUT",
        ],
        answer: 1,
        explanation:
          "If-Match asserts that the resource is still the version the client read, and the server answers 412 Precondition Failed when it is not, which is optimistic concurrency control. If-None-Match with 304 is the read side mechanism for saving bandwidth and does nothing to protect a write.",
        difficulty: "Medium",
        skill: "Conditional requests",
      },
      {
        n: 5,
        question:
          "A response body differs depending on the Accept-Language request header, but no Vary header is sent. What breaks?",
        options: [
          "Nothing, since language is negotiated per request",
          "A shared cache may serve one visitor's language to another",
          "The browser refuses to render the response",
          "Compression stops working",
        ],
        answer: 1,
        explanation:
          "Vary names the request headers that participate in the cache key, so without it a shared cache treats all requests to that URL as equivalent and serves whichever variant it stored first. Answering that nothing breaks is tempting because negotiation genuinely is per request at the origin, but a cache between the two sides never repeats that negotiation, and the response still renders fine, so the bug appears only once a CDN sits in front of the service.",
        difficulty: "Medium",
        skill: "Content negotiation",
      },
      {
        n: 6,
        question:
          "Why must a weak ETag not be used with If-Match on a write?",
        options: [
          "Weak ETags are not sent by browsers",
          "Weak comparison accepts semantically equivalent representations, which can differ in the field about to be overwritten",
          "If-Match only accepts numeric validators",
          "Weak ETags expire after one request",
        ],
        answer: 1,
        explanation:
          "A weak validator asserts only that two representations mean the same thing, so a match does not prove the bytes are unchanged and a lost update can still slip through. Thinking browsers do not send weak ETags is the tempting misconception: they do, and caching relies on exactly that looser comparison.",
        difficulty: "Hard",
        skill: "Conditional requests",
      },
      {
        n: 7,
        question:
          "A client posts a booking for a seat that another user has just taken. Which status best describes the situation?",
        options: [
          "400 Bad Request",
          "422 Unprocessable Content",
          "409 Conflict",
          "500 Internal Server Error",
        ],
        answer: 2,
        explanation:
          "The payload is well formed and individually valid, so the failure is a contradiction with current state, which is exactly what 409 signals and which tells the client to refetch and retry. 422 is the tempting alternative but says the payload itself could never be processed, which would wrongly discourage a retry.",
        difficulty: "Medium",
        skill: "Status code families",
      },
      {
        n: 8,
        question:
          "Why do 307 and 308 exist alongside 302 and 301?",
        options: [
          "They allow redirects across origins, which 301 and 302 forbid",
          "They preserve the original method and body, which the older codes were widely implemented as rewriting to GET",
          "They are cacheable while the older codes are not",
          "They permit more than one Location header",
        ],
        answer: 1,
        explanation:
          "Historical implementations turned a redirected POST into a GET, so the newer codes were introduced to guarantee the method and body survive. Believing the difference is about cross origin behaviour is a common mix up with CORS, which is an entirely separate mechanism.",
        difficulty: "Hard",
        skill: "Method semantics",
      },
    ],
  },

  5002: {
    topicId: 5002,
    title: "Semantic HTML and the accessibility tree",
    summary:
      "Write markup that describes meaning rather than appearance, and learn how browsers turn that markup into the accessibility tree that assistive technology, and much of your keyboard support, actually reads.",
    concepts: [
      "Semantic elements",
      "Accessibility tree",
      "Implicit roles",
      "Accessible name computation",
      "Landmarks and headings",
      "Focus order",
    ],
    glossary: {
      "Accessibility tree":
        "The parallel tree the browser derives from the DOM, containing only nodes that expose meaning, each with a role, a name and a state.",
      "Implicit role":
        "The role an element carries by virtue of being that element, for example a button element having the button role without any ARIA attribute.",
      "Accessible name":
        "The short label announced for a node, computed from aria-label, associated label elements, alt text or the node's own text, in a defined order of preference.",
      Landmark:
        "A region role such as navigation, main or banner that lets a screen reader user jump directly to a part of the page.",
      "aria-hidden":
        "An attribute that removes a node and its entire subtree from the accessibility tree while leaving it visible on screen.",
      "Focus order":
        "The sequence in which interactive elements receive focus when tabbing, derived from document order unless tabindex overrides it.",
      "Alternative text":
        "The alt attribute on an image, where an empty value is a deliberate statement that the image is decorative and should be ignored.",
    },
    body: {
      Beginner: `<p>Browsers do not only draw your page. They also build a second, invisible description of it for software that cannot see: screen readers, voice control, switch devices and, to a surprising extent, the keyboard. That description is called the <strong>accessibility tree</strong>, and the raw material for it is your HTML.</p>
<h2>The element you choose is a statement</h2>
<p>A <code>&lt;div&gt;</code> with a click handler and a <code>&lt;button&gt;</code> can look identical. To the invisible description they are worlds apart. The real button announces itself as a button, can be reached with the Tab key, fires on both Enter and Space, and reports when it is disabled. The div announces nothing, is skipped when tabbing, and responds only to a mouse.</p>
<ul>
<li><code>&lt;nav&gt;</code> says this block is navigation.</li>
<li><code>&lt;main&gt;</code> says this is the primary content, so skip past everything before it.</li>
<li><code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> form an outline a user can jump through, like a table of contents.</li>
<li><code>&lt;ul&gt;</code> and <code>&lt;li&gt;</code> announce how many items there are before reading them out.</li>
</ul>
<h2>Names</h2>
<p>Every meaningful node needs a short label, its <strong>accessible name</strong>. Usually it comes from the text inside, so a button reading Save is simply called Save. An image takes its name from <code>alt</code>. An icon only button has no text at all, so it needs <code>aria-label="Close"</code> or it will be announced as just <em>button</em>, which tells the user nothing.</p>
<aside class="tip">An image that is purely decorative should carry <code>alt=""</code>, an empty value. That is not laziness, it is an instruction: ignore this, it adds nothing. Omitting <code>alt</code> altogether is the mistake, because then some screen readers read out the filename.</aside>
<h2>Two rules that catch most problems</h2>
<p>First, if something is clickable, make it a <code>&lt;button&gt;</code> or an <code>&lt;a href&gt;</code>. Second, put things in the document in the order you want them read, because the <strong>focus order</strong> follows the source, not what CSS moved around on screen. Almost every accessibility bug a beginner writes is one of those two rules broken.</p>`,
      Intermediate: `<p>The accessibility tree is not an add on. It is a projection of the DOM that the browser computes on every relevant change, and assistive technology reads it in preference to anything you draw. Learning the rules of that projection turns accessibility from a checklist into something you can reason about.</p>
<h2>What the tree contains</h2>
<p>Each node in the <strong>accessibility tree</strong> carries a role, a name, a description and a set of states. Nodes that convey nothing, such as a purely presentational <code>&lt;div&gt;</code> or <code>&lt;span&gt;</code>, are collapsed away. Nodes hidden with <code>display: none</code> are absent entirely. Nodes marked <code>aria-hidden="true"</code> are removed along with their whole subtree while remaining perfectly visible on screen, which is the correct treatment for a decorative icon sitting beside a text label.</p>
<h2>Implicit roles come free</h2>
<p>Most roles you need already exist as elements. <code>&lt;button&gt;</code> is <code>button</code>, <code>&lt;a href&gt;</code> is <code>link</code>, <code>&lt;nav&gt;</code> is <code>navigation</code>, <code>&lt;ul&gt;</code> is <code>list</code> and each <code>&lt;li&gt;</code> is <code>listitem</code>. An <code>&lt;a&gt;</code> without an <code>href</code> is not a link at all, merely a generic node, which is why anchor based buttons so often disappear from the tree. Using the right element gives you the role, the keyboard behaviour and the state reporting together; adding <code>role="button"</code> to a div gives you only the first of the three.</p>
<h2>Name computation, in order</h2>
<p>The <strong>accessible name computation</strong> follows a defined precedence, and knowing the order explains most surprises:</p>
<ul>
<li><code>aria-labelledby</code>, which points at other elements and uses their text.</li>
<li><code>aria-label</code>, a literal string on the node itself.</li>
<li>Native markup: a <code>&lt;label for&gt;</code> for a form control, <code>alt</code> for an image, a <code>&lt;caption&gt;</code> for a table.</li>
<li>The node's own text content, with any <code>aria-hidden</code> subtrees excluded.</li>
</ul>
<p>Because <code>aria-label</code> outranks text content, putting it on a button that already reads Save and setting it to something else means the screen reader says one thing while the screen says another, and voice control users can no longer activate it by saying what they see.</p>
<h2>Structure is navigation</h2>
<p>Screen reader users rarely read linearly. They jump by <strong>landmark</strong> and by heading, so <code>&lt;main&gt;</code>, <code>&lt;nav&gt;</code> and a heading outline that descends without skipping levels are functionally the page's table of contents. A page whose only heading is a styled <code>&lt;div class="title"&gt;</code> is a page with no way in.</p>
<aside class="tip">Never reorder content with CSS in a way that contradicts the source. Grid and flexbox can move a block visually while <strong>focus order</strong> still follows the DOM, and the result is a keyboard user watching focus jump around the screen apparently at random.</aside>
<h2>Testing it</h2>
<p>Two checks catch most regressions and neither needs special software: tab through the page and confirm the focus ring is always visible and always somewhere sensible, and open the accessibility panel in developer tools to read the computed role and name of every interactive node. If a control has role generic or an empty name, it is broken regardless of how it looks.</p>`,
      Advanced: `<p>Assume the roles and the name computation. The difficult territory is composite widgets, dynamic updates and the places where the specification and the implementations disagree.</p>
<h2>Where implicit roles stop being enough</h2>
<p>Native elements cover the atoms. A combobox, a tree grid or a tab set has no single element, so it becomes a composition you must describe: roles on each part, ownership relations through <code>aria-controls</code> and <code>aria-activedescendant</code>, plus a keyboard model the platform expects. The keyboard model is the part usually missed. A tab set requires arrow keys to move between tabs while Tab itself moves out of the set entirely, and a widget that puts every tab in the tab sequence is not merely unconventional, it is unusable at length.</p>
<h2>Dynamic content and live regions</h2>
<p>The <strong>accessibility tree</strong> is recomputed as the DOM changes, but a change is not automatically announced. A live region declares that a container's updates should be spoken, with <code>aria-live="polite"</code> queueing behind current speech and <code>assertive</code> interrupting. The failure modes are specific: the region must already exist in the DOM before the update, since inserting a populated live region often announces nothing, and a region that wraps too much content will re announce unrelated text on every unrelated change.</p>
<h2>Focus management across route changes</h2>
<p>A client side navigation replaces the content without moving focus, so a screen reader user stays parked on a link that no longer exists in a page they were not told had changed. The remedy is explicit: move focus to the new page's heading, made programmatically focusable with <code>tabindex="-1"</code>, and consider announcing the new title in a live region. The same obligation applies to opening a dialog, where focus moves in, is trapped for the duration, and returns to the trigger on close.</p>
<ul>
<li><code>aria-hidden="true"</code> on an ancestor of the focused element leaves focus somewhere the tree says does not exist, a state that behaves unpredictably across screen readers.</li>
<li>The <code>inert</code> attribute is the correct tool for backgrounding content behind a modal, because it removes both interaction and focusability rather than only the announcement.</li>
<li>Positive <code>tabindex</code> values create a second sequence that runs before every natural one on the page, which is why the practical rule is to use only 0 and negative one.</li>
</ul>
<aside class="tip">Any ARIA attribute you add is a promise about behaviour that you must now implement and keep implemented. <code>aria-expanded</code> that never changes, or <code>aria-selected</code> left on a removed node, is worse than no attribute at all, because the user is told a state that is not true.</aside>`,
      Expert: `<p>Read the accessibility layer as a second public API for your interface, one whose consumers are platform APIs rather than your own code. The DOM is the source, the accessibility tree is the projection, and each operating system then maps that projection onto its own interface, UI Automation on Windows, NSAccessibility on macOS. Every mapping loses something, which is why behaviour is not uniform even when the tree is correct.</p>
<h2>Name computation is more subtle than the summary</h2>
<p>The algorithm is recursive and context dependent. Traversal into a subtree for naming purposes includes nodes that would themselves be excluded when encountered directly, so text inside an element hidden by <code>display: none</code> is skipped, but text inside a node referenced by <code>aria-labelledby</code> is used even when that node is hidden. Recursion is guarded against cycles, and CSS generated content from <code>::before</code> and <code>::after</code> participates in most engines, which is the mechanism behind the icon font that quietly appends a private use codepoint to a button's <strong>accessible name</strong>. Because the resulting name is a flat string, a control whose visible label is assembled from several elements is fine, and a control whose name depends on styling is not.</p>
<h2>Where the guidance is routinely misapplied</h2>
<ul>
<li><strong>Roles do not confer behaviour.</strong> <code>role="button"</code> supplies the announcement and nothing else: no focusability, no Space and Enter activation, no disabled semantics. The frequently cited advice to prefer native elements is not stylistic, it is a statement about how much unimplemented work a role hides.</li>
<li><strong>aria-hidden and visibility are orthogonal.</strong> Removing a node from the tree while it remains focusable produces a node that can be reached and cannot be described. <code>inert</code> exists because that combination is otherwise unreachable through ARIA alone.</li>
<li><strong>Landmarks are a budget.</strong> Every region marked as a <strong>landmark</strong> lengthens the jump list, so a page with fifteen navigation regions has replaced a table of contents with a haystack.</li>
<li><strong>The heading outline is not derived from sectioning elements.</strong> The proposed document outline algorithm was never implemented, so heading level is exactly the number you wrote and nesting a section does not demote its heading.</li>
</ul>
<h2>Performance and the tree</h2>
<p>Building the tree is not free. Engines compute it lazily and invalidate on mutation, so a component that rewrites a large subtree on every keystroke forces repeated recomputation, and on assistive technology that mirrors the tree into another process this appears as speech lagging seconds behind typing. Virtualised lists interact badly here as well: <code>aria-setsize</code> and <code>aria-posinset</code> exist precisely because the tree contains only the rendered window and would otherwise announce item three of twelve in a list of ten thousand.</p>
<aside class="tip">Automated scanners verify the tree's shape, never its truthfulness. They cannot tell you that the accessible name of a button says Delete while it archives, that <strong>focus order</strong> crosses the page diagonally, or that a live region announces a value nobody asked to hear. Those require someone to use the interface without looking at it.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Build the accessibility tree",
        difficulty: "Medium",
        statement: `<p>Browsers derive an <strong>accessibility tree</strong> from the DOM by keeping only nodes that expose meaning, and giving each one a role and an accessible name. Implement that projection.</p>
<p>You are given a node shaped like this:</p>
<pre>{ tag: "nav", attrs: { "aria-label": "Primary" }, text: "", children: [ ... ] }</pre>
<p><code>attrs</code>, <code>text</code> and <code>children</code> may be missing. Return an array of <code>{ role, name }</code> objects in document order, applying these rules:</p>
<ul>
<li>A node with <code>aria-hidden</code> set to <code>"true"</code> is dropped, together with its entire subtree.</li>
<li>Roles come from the tag: <code>button</code> gives <code>button</code>, <code>nav</code> gives <code>navigation</code>, <code>main</code> gives <code>main</code>, <code>ul</code> and <code>ol</code> give <code>list</code>, <code>li</code> gives <code>listitem</code>, <code>img</code> gives <code>img</code>, and <code>h1</code> through <code>h6</code> all give <code>heading</code>.</li>
<li>An <code>a</code> is a <code>link</code> only when it has a non empty <code>href</code>, otherwise it has no role.</li>
<li>An <code>input</code> is a <code>checkbox</code> when its <code>type</code> is <code>"checkbox"</code>, otherwise a <code>textbox</code>.</li>
<li>An <code>img</code> with <code>alt</code> set to the empty string is decorative and has no role.</li>
<li>Any other tag has no role. A node with no role is not emitted, but its children are still visited.</li>
</ul>
<p>The name is <code>aria-label</code> if present. Otherwise, for an <code>img</code> it is the <code>alt</code> value or the empty string, and for anything else it is the node's own text plus the text of all its descendants, joined with single spaces and trimmed, skipping any <code>aria-hidden</code> subtree.</p>`,
        fn: "accessibleNodes",
        params: "node",
        tests: [
          {
            args: [
              {
                tag: "nav",
                children: [
                  { tag: "a", attrs: { href: "/pricing" }, text: "Pricing" },
                  { tag: "a", text: "Careers" },
                ],
              },
            ],
            expected: [
              { role: "navigation", name: "Pricing Careers" },
              { role: "link", name: "Pricing" },
            ],
            label: "basic landmark and links",
          },
          {
            args: [
              {
                tag: "button",
                attrs: { "aria-label": "Close dialog" },
                children: [{ tag: "span", attrs: { "aria-hidden": "true" }, text: "x" }],
              },
            ],
            expected: [{ role: "button", name: "Close dialog" }],
            label: "aria-label beats hidden icon text",
          },
          {
            args: [
              {
                tag: "div",
                children: [
                  { tag: "img", attrs: { alt: "" } },
                  { tag: "img", attrs: { alt: "Team photo" } },
                  { tag: "input", attrs: { type: "checkbox", "aria-label": "Remember me" } },
                ],
              },
            ],
            expected: [
              { role: "img", name: "Team photo" },
              { role: "checkbox", name: "Remember me" },
            ],
            label: "decorative image dropped",
          },
          {
            args: [{ tag: "section", children: [] }],
            expected: [],
            label: "empty document",
          },
          {
            args: [
              {
                tag: "main",
                children: [
                  { tag: "h2", text: "Orders" },
                  {
                    tag: "ul",
                    children: [
                      { tag: "li", text: "One" },
                      { tag: "li", attrs: { "aria-hidden": "true" }, text: "Two" },
                    ],
                  },
                ],
              },
            ],
            expected: [
              { role: "main", name: "Orders One" },
              { role: "heading", name: "Orders" },
              { role: "list", name: "One" },
              { role: "listitem", name: "One" },
            ],
            label: "hidden subtree removed from names and tree",
            hidden: true,
          },
        ],
        hints: [
          "Two separate walks are hiding in this problem: one that emits nodes, and one that gathers text for a name. Write the text gatherer first and test it on its own.",
          "Both walks must obey aria-hidden, so the name of an ancestor never contains text from a hidden descendant.",
          "Emit only when the tag maps to a role, but recurse into children unconditionally, because a plain div can still contain a button.",
        ],
        solution: `function accessibleNodes(node) {
  var ROLES = {
    button: "button", nav: "navigation", main: "main", ul: "list", ol: "list",
    li: "listitem", img: "img", h1: "heading", h2: "heading", h3: "heading",
    h4: "heading", h5: "heading", h6: "heading"
  };
  var out = [];
  function hidden(n) {
    return !!(n.attrs && n.attrs["aria-hidden"] === "true");
  }
  function textOf(n) {
    if (hidden(n)) return "";
    var parts = n.text ? [n.text] : [];
    var kids = n.children || [];
    for (var i = 0; i < kids.length; i++) parts.push(textOf(kids[i]));
    return parts.join(" ").replace(/\\s+/g, " ").trim();
  }
  function roleOf(n) {
    var attrs = n.attrs || {};
    if (n.tag === "a") return attrs.href ? "link" : null;
    if (n.tag === "input") return attrs.type === "checkbox" ? "checkbox" : "textbox";
    if (n.tag === "img" && attrs.alt === "") return null;
    return ROLES[n.tag] || null;
  }
  function walk(n) {
    if (!n || hidden(n)) return;
    var attrs = n.attrs || {};
    var role = roleOf(n);
    if (role) {
      var name;
      if (attrs["aria-label"]) name = attrs["aria-label"];
      else if (n.tag === "img") name = attrs.alt || "";
      else name = textOf(n);
      out.push({ role: role, name: name });
    }
    var kids = n.children || [];
    for (var i = 0; i < kids.length; i++) walk(kids[i]);
  }
  walk(node);
  return out;
}`,
        skills: ["Accessibility tree", "Implicit roles", "Accessible name computation"],
      },
    ],
  },

  5003: {
    topicId: 5003,
    title: "CSS layout: flexbox and grid in anger",
    summary:
      "Choose between flexbox and grid deliberately rather than by habit, and learn to predict the size a browser will give each item before you open developer tools.",
    concepts: [
      "Flex sizing algorithm",
      "Main and cross axis",
      "Grid template areas",
      "Intrinsic sizing",
      "Overflow and minimum size",
      "Alignment and spacing",
    ],
    glossary: {
      "Flex basis":
        "The size a flex item starts from before any free space is distributed, defaulting to the item's content size.",
      "Flex grow":
        "A unitless share of the positive free space an item receives, so an item with grow two takes twice the surplus of an item with grow one.",
      "Flex shrink":
        "A share of the overflow an item absorbs, weighted by its own basis so larger items give up more.",
      "Intrinsic sizing":
        "Sizing driven by content, expressed by keywords such as min-content, max-content and fit-content.",
      "min-width auto":
        "The default minimum size of a flex item, which is its content size and is the usual reason a flex child refuses to shrink.",
      "Grid template area":
        "A named rectangular region declared in grid-template-areas that an item can be placed into by name.",
      "fr unit":
        "A grid unit representing a share of the leftover space in a track dimension, distributed after fixed sizes are taken.",
      Gutter:
        "The gap between tracks or flex items, set with the gap property and excluded from the space available to items.",
    },
    body: {
      Beginner: `<p>Layout is the part of CSS where guessing costs the most time. Two systems do nearly all of the work in modern pages, and picking the right one first makes everything afterwards easier.</p>
<h2>One direction or two</h2>
<p>Flexbox arranges things along a single line: a row of buttons, a header with a logo on the left and a menu on the right, a list of tags that wraps when it runs out of room. Grid arranges things in rows and columns at the same time: a page with a sidebar and a content area, a gallery of cards in a tidy matrix.</p>
<p>The short rule: if you are laying out <em>a line of things</em>, reach for flex. If you are laying out <em>a shape</em>, reach for grid.</p>
<h2>How flex decides sizes</h2>
<p>Every flex item starts at a size called its <strong>flex basis</strong>, which by default is however big its content wants to be. The browser adds those up, subtracts them from the space available, and one of two things happens.</p>
<ul>
<li>There is space left over. It is shared out according to <code>flex-grow</code>. An item with grow of one and an item with grow of three split the surplus one part to three.</li>
<li>There is not enough space. The overflow is taken back according to <code>flex-shrink</code>, and bigger items give up more than smaller ones.</li>
</ul>
<aside class="tip">Gaps are taken out first. In a 620 pixel container with a 20 pixel gap and two items, only 600 pixels are available to share, so both items end at 300. Forgetting the gap is the most common reason a hand calculation disagrees with the browser.</aside>
<h2>The classic frustration</h2>
<p>A long piece of text inside a flex item refuses to shrink and pushes everything sideways. This is not a bug. A flex item will not shrink below the size of its own content unless you say so, and the fix is a single line: <code>min-width: 0</code> on the item.</p>
<h2>A first grid</h2>
<p>Grid lets you draw the layout in the stylesheet. Give the container <code>grid-template-columns: 240px 1fr</code> and you have a fixed sidebar with a content area that takes everything remaining. The <code>1fr</code> means one share of the leftover space, which is why it stretches on a wide screen and behaves on a narrow one.</p>`,
      Intermediate: `<p>Both layout systems are constraint solvers. If you can describe the constraints they are solving, you can predict their output, and layout debugging stops being trial and error.</p>
<h2>The flex algorithm, stated once</h2>
<p>For a single line of items the browser computes the inner size of the container, subtracts the gutters, then compares the sum of the items' bases to what remains.</p>
<ul>
<li>If free space is positive, each item receives its share of it in proportion to its <code>flex-grow</code> value. If every grow value is zero, the surplus stays unused and alignment properties decide where it sits.</li>
<li>If free space is negative, the deficit is removed in proportion to each item's <code>flex-shrink</code> multiplied by its own basis, so a 400 pixel item shrinks twice as fast as a 200 pixel item at the same shrink factor.</li>
<li>The result is then clamped by each item's minimum and maximum sizes, and any item that hits a bound is frozen while the remainder is redistributed.</li>
</ul>
<p>The shorthand <code>flex: 1</code> expands to grow one, shrink one, basis zero. The zero basis is the part that surprises people: content size stops participating entirely, so three items with <code>flex: 1</code> end up exactly equal regardless of what is inside them, while <code>flex: 1 1 auto</code> keeps content proportional.</p>
<h2>Axes are logical, not visual</h2>
<p>Everything in flexbox is expressed against the <strong>main and cross axis</strong>, not left and right. <code>justify-content</code> distributes along the main axis, <code>align-items</code> across it, and the two swap meaning the moment <code>flex-direction</code> becomes <code>column</code>. Half of all flexbox confusion is reaching for <code>justify-content</code> to centre something vertically in a row container, where the property that does it is <code>align-items</code>.</p>
<h2>Grid where flex struggles</h2>
<p>Grid's advantage is alignment across siblings. In a row of flex cards, each card sizes its own internals, so titles of different lengths push the prices to different heights. Give each card <code>display: grid</code> with <code>grid-template-rows: auto 1fr auto</code> and every price lines up, because the row track is shared. <strong>Grid template areas</strong> take this further: naming regions in <code>grid-template-areas</code> lets the entire page layout change in a media query by rewriting one declaration, with no change to the markup or to any child rule.</p>
<h2>Intrinsic sizing keywords</h2>
<p><strong>Intrinsic sizing</strong> gives you content driven sizes without measurement. <code>min-content</code> is the narrowest a box can be without overflowing, which for text is the longest word. <code>max-content</code> is the width it would take with no wrapping at all. <code>fit-content</code> behaves as max-content until it hits the available space and then wraps. <code>minmax(240px, 1fr)</code> combined with <code>auto-fill</code> produces a responsive card grid with no media queries whatsoever.</p>
<aside class="tip">When something overflows its container, check the minimum size before anything else. Flex items default to <code>min-width: auto</code> and grid items to <code>min-width: auto</code> in the inline axis, both meaning content size. Setting <code>min-width: 0</code> or <code>overflow: hidden</code> resolves the large majority of these cases.</aside>`,
      Advanced: `<p>Assume the algorithms. What separates a layout that survives real content from one that demos well is how it behaves at the boundaries: long unbroken strings, absent data, nested scroll containers and writing modes you did not design for.</p>
<h2>Percentages and the resolution problem</h2>
<p>A percentage size resolves against the containing block, so a percentage height inside a parent of indefinite height is not resolvable and is treated as auto. Flexbox complicates this: <code>flex-basis</code> as a percentage resolves against the container's main size, which is often definite even when the block direction is not, so a percentage basis frequently works where a percentage height does not. Nested flex containers compound it further, because an item is both a flex item to its parent and a flex container to its children, and its automatic minimum size can propagate a scrollbar two levels up.</p>
<h2>The frozen item detail</h2>
<p>The <strong>flex sizing algorithm</strong> is iterative, not a single division. After the initial distribution any item whose size violated a minimum or maximum is clamped and frozen, then the remaining free space is recalculated and redistributed among the unfrozen items, repeating until nothing violates. This is why adding <code>max-width</code> to one item can change the size of every sibling, and why a hand computation that models only one round disagrees with the browser precisely when a constraint binds.</p>
<h2>Grid placement subtleties</h2>
<ul>
<li>Auto placement is order sensitive. An explicitly placed item at column three creates gaps that <code>grid-auto-flow: dense</code> will backfill, at the price of visual order diverging from DOM order, which breaks the reading and focus sequence.</li>
<li><code>auto-fill</code> and <code>auto-fit</code> differ only when tracks are empty: <code>auto-fill</code> keeps the empty tracks, <code>auto-fit</code> collapses them so the remaining items stretch. A single card in a gallery is the case where the choice becomes visible.</li>
<li>Subgrid lets a nested grid adopt its parent's tracks, which is the only clean way to align content across cards that are themselves grid items.</li>
<li>Named lines created implicitly by <strong>grid template areas</strong>, such as <code>content-start</code>, can be targeted directly and remove most explicit line numbers from a stylesheet.</li>
</ul>
<h2>Performance and containment</h2>
<p>Layout cost is proportional to the size of the subtree the browser must reflow. <code>contain: layout</code> or <code>content-visibility: auto</code> tells the engine that a subtree's internals cannot affect anything outside it, which turns a full page reflow into a local one. This matters most for long lists where an intrinsically sized item forces a measurement pass across every sibling.</p>
<aside class="tip">Test every layout with the three inputs real users supply: a single word forty characters long, an empty string, and text at triple the length you designed for. <strong>Overflow and minimum size</strong> problems are invisible with placeholder content and unavoidable with real content.</aside>`,
      Expert: `<p>Flexbox and grid are two instances of the same idea: a container that distributes space among children under constraints, differing in whether the distribution is one dimensional and content driven or two dimensional and track driven. Reading them that way makes the surprising cases predictable, because almost all of them come from the point where free space becomes negative or a size becomes indefinite.</p>
<h2>Definite, indefinite and the intrinsic passes</h2>
<p>A layout engine cannot resolve every size in one traversal. Sizes that depend on content require an intrinsic contribution pass upward before the final layout pass downward, and any construct that makes a child's size depend on the parent while the parent's size depends on the child forces a resolution rule rather than a computation. This is the origin of several documented behaviours that are usually reported as bugs: percentage padding resolving against the inline size in both axes, <code>flex-basis: auto</code> falling back to the width property, and stretch alignment producing a different result from an explicit hundred percent because stretch respects the item's own maximum while the percentage does not.</p>
<h2>What the popular guidance gets wrong</h2>
<ul>
<li><strong>Shrink is not proportional to shrink factor alone.</strong> It is proportional to the factor multiplied by the flex base size, a weighting that exists so that equally shrinkable items reach zero together rather than the smallest reaching zero first.</li>
<li><strong>fr is not a percentage.</strong> An <code>fr</code> track has an automatic minimum of <code>auto</code>, so <code>1fr 1fr</code> tracks are equal only while their contents fit. <code>minmax(0, 1fr)</code> is the declaration people usually intend when they write <code>1fr</code>.</li>
<li><strong>gap is not margin.</strong> Gutters are removed from the space available to <strong>intrinsic sizing</strong> before distribution, so a container's min-content contribution includes its gaps, which changes wrapping thresholds in ways margins would not.</li>
<li><strong>order and the visual reordering of grid do not move focus.</strong> The specification states plainly that these properties affect painting and layout, not the document sequence used for sequential navigation, and no browser reconciles the two.</li>
</ul>
<h2>Logical properties as the durable form</h2>
<p>Writing <code>inline-size</code>, <code>margin-inline</code> and <code>padding-block</code> rather than width, horizontal margins and vertical padding makes the same stylesheet correct under right to left and vertical writing modes. This is not only an internationalisation concern: flexbox and grid already describe themselves in <strong>main and cross axis</strong> terms, so mixing physical properties into a logical layout system is what produces stylesheets that break when direction changes and that nobody can reason about afterwards.</p>
<aside class="tip">When a layout is wrong, ask three questions in order. What is the containing block, is its size definite in the axis in question, and what is the item's automatic minimum. Nearly every unexplained layout result resolves at one of those three points, and none of them are visible in the rendered output.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Resolve flex item widths",
        difficulty: "Medium",
        statement: `<p>Implement the single line flex sizing algorithm along the main axis, ignoring wrapping and item minimums.</p>
<p>You receive the container's inner width, the gap between items, and an array of items shaped <code>{ basis, grow, shrink }</code>. <code>grow</code> and <code>shrink</code> may be missing, in which case treat <code>grow</code> as 0 and <code>shrink</code> as 1.</p>
<ul>
<li>Available space is <code>container - gap * (items.length - 1)</code>.</li>
<li>Free space is the available space minus the sum of all bases.</li>
<li>If free space is positive, each item gets <code>basis + free * grow / totalGrow</code>. If every grow is 0, every item keeps its basis.</li>
<li>If free space is negative, weight each item by <code>shrink * basis</code> and give it <code>basis + free * weight / totalWeight</code>. If every weight is 0, every item keeps its basis.</li>
<li>Never return a negative width, and round every result to two decimal places.</li>
</ul>
<p>Return an array of widths in the same order as the items, or an empty array when there are no items.</p>`,
        fn: "flexWidths",
        params: "container, gap, items",
        tests: [
          {
            args: [600, 0, [{ basis: 100, grow: 1 }, { basis: 100, grow: 1 }]],
            expected: [300, 300],
            label: "basic equal growth",
          },
          {
            args: [620, 20, [{ basis: 100, grow: 1 }, { basis: 100, grow: 1 }]],
            expected: [300, 300],
            label: "gap consumes space first",
          },
          {
            args: [700, 0, [{ basis: 100, grow: 1 }, { basis: 100, grow: 3 }]],
            expected: [225, 475],
            label: "growth is proportional",
          },
          {
            args: [600, 0, [{ basis: 100 }, { basis: 100 }]],
            expected: [100, 100],
            label: "no grow leaves free space unused",
          },
          {
            args: [300, 0, [{ basis: 200, shrink: 1 }, { basis: 400, shrink: 1 }]],
            expected: [100, 200],
            label: "shrink is weighted by basis",
          },
          {
            args: [300, 0, [{ basis: 200, shrink: 0 }, { basis: 400, shrink: 1 }]],
            expected: [200, 100],
            label: "shrink zero refuses to give space back",
            hidden: true,
          },
          {
            args: [500, 10, []],
            expected: [],
            label: "empty container",
          },
        ],
        hints: [
          "Work out the available space before you look at a single item: the gutters are removed first, and the count of gaps is one fewer than the count of items.",
          "Growth and shrinkage are two different distributions. Growth divides by the total grow factor; shrinkage divides by the total of shrink multiplied by basis.",
          "Compute in full precision and round only the final widths, otherwise the rounding error accumulates across items and the total no longer matches the container.",
        ],
        solution: `function flexWidths(container, gap, items) {
  var n = items.length;
  if (n === 0) return [];
  var available = container - gap * (n - 1);
  var bases = items.map(function (i) { return i.basis; });
  var total = bases.reduce(function (a, b) { return a + b; }, 0);
  var free = available - total;
  var widths;
  if (free > 0) {
    var totalGrow = items.reduce(function (a, i) { return a + (i.grow || 0); }, 0);
    widths = bases.map(function (b, idx) {
      if (totalGrow <= 0) return b;
      return b + free * (items[idx].grow || 0) / totalGrow;
    });
  } else if (free < 0) {
    var weights = items.map(function (i, idx) {
      var s = i.shrink === undefined ? 1 : i.shrink;
      return s * bases[idx];
    });
    var totalWeight = weights.reduce(function (a, b) { return a + b; }, 0);
    widths = bases.map(function (b, idx) {
      if (totalWeight <= 0) return b;
      return b + free * weights[idx] / totalWeight;
    });
  } else {
    widths = bases.slice();
  }
  return widths.map(function (w) {
    return Math.round(Math.max(0, w) * 100) / 100;
  });
}`,
        skills: ["Flex sizing algorithm", "Alignment and spacing", "Overflow and minimum size"],
      },
    ],
  },

  5004: {
    topicId: 5004,
    title: "Closures, scope and the event loop",
    summary:
      "Understand what a JavaScript function captures, when it runs, and why a value read inside a callback is so often not the value you expected when you wrote it.",
    concepts: [
      "Lexical scope",
      "Closure capture",
      "Call stack",
      "Task and microtask queues",
      "Hoisting and the temporal dead zone",
      "this binding",
    ],
    glossary: {
      Closure:
        "A function together with the variable bindings it captured from the scope where it was defined, which stay alive for as long as the function does.",
      "Lexical scope":
        "Scope determined by where code is written rather than by where it is called from, which is why nesting decides visibility.",
      "Call stack":
        "The stack of frames for functions currently executing, which must be empty before the runtime processes any queued work.",
      Microtask:
        "Work queued by a promise reaction or by queueMicrotask, drained completely after the current stack empties and before the next task.",
      "Task queue":
        "The queue of larger units of work such as timer callbacks and events, from which the runtime takes exactly one item per turn.",
      "Temporal dead zone":
        "The region between entering a scope and executing a let or const declaration, where touching the binding throws a ReferenceError.",
      "Event loop":
        "The scheduler that runs a task, drains all microtasks, optionally renders, and repeats.",
    },
    body: {
      Beginner: `<p>Two ideas explain most of the JavaScript that seems to behave illogically. The first is what a function can see. The second is when it runs. Neither is complicated once you stop assuming that code runs in the order it appears on the page.</p>
<h2>What a function can see</h2>
<p>A function can read the variables that surrounded it <em>where it was written</em>. Not where it is called. Write a function inside another function and it can still see the outer one's variables, forever, even after the outer function has finished.</p>
<pre>function counter() {
  let n = 0;
  return function () { n = n + 1; return n; };
}
const next = counter();
next(); // 1
next(); // 2</pre>
<p>The variable <code>n</code> did not disappear when <code>counter</code> returned, because the inner function is still holding on to it. That pairing of a function with the variables it kept is called a <strong>closure</strong>, and it is how JavaScript does private state.</p>
<h2>When code runs</h2>
<p>JavaScript does one thing at a time. Anything that takes time, such as a timer or a network reply, does not interrupt your code. It waits in a queue and runs only once your current work has completely finished.</p>
<pre>console.log("first");
setTimeout(function () { console.log("third"); }, 0);
console.log("second");</pre>
<p>The timer says zero milliseconds and still prints last, because zero means <em>as soon as you are free</em>, not <em>now</em>.</p>
<aside class="tip">Promise callbacks jump the queue ahead of timers. Anything attached with <code>.then</code> runs as soon as the current code finishes, before any timer that was already waiting. That single ordering rule explains a surprising number of confusing logs.</aside>
<h2>The classic trap</h2>
<p>Using <code>var</code> in a loop with a timer prints the same number every time, because <code>var</code> creates one shared variable for the whole loop. Using <code>let</code> prints the numbers you expected, because <code>let</code> creates a fresh binding on each iteration for each callback to capture.</p>`,
      Intermediate: `<p>Scope answers what a function can reach; the event loop answers when it reaches it. Most confusing bugs in asynchronous code are a collision of the two, where a callback captured a binding correctly and then ran at a moment you did not plan for.</p>
<h2>Scope is decided at authoring time</h2>
<p><strong>Lexical scope</strong> means an identifier is resolved by walking outwards through the scopes that physically enclose the code, all the way to the module or global scope. Function declarations and <code>var</code> are hoisted to the top of their function scope, initialised to undefined. <code>let</code> and <code>const</code> are hoisted too, but remain uninitialised until their declaration executes, and touching them before that throws rather than yielding undefined. That interval is the <strong>temporal dead zone</strong>, and it exists so that use before definition fails loudly.</p>
<h2>Closures capture bindings, not values</h2>
<p>This is the sentence worth memorising. A <strong>closure</strong> holds a reference to the variable itself, so if the variable is later reassigned, the closure observes the new value. A <code>var</code> loop has one binding for all iterations, so every callback shares it and sees the final value. A <code>let</code> loop creates a fresh binding per iteration, so each callback sees its own. The same mechanic explains stale values in React callbacks: the callback captured the binding from the render in which it was created, and a later render created a different binding entirely.</p>
<h2>The loop itself</h2>
<p>One turn of the <strong>event loop</strong> is precisely defined:</p>
<ul>
<li>Take one item from the <strong>task queue</strong>, for example a timer callback, an incoming message or a click, and run it to completion.</li>
<li>Drain the microtask queue completely, including any microtasks added while draining, so a promise chain finishes entirely before anything else is considered.</li>
<li>Render, if the browser judges it useful.</li>
<li>Repeat.</li>
</ul>
<p>Two consequences follow. A long synchronous function blocks everything, including rendering, because nothing else can start until the <strong>call stack</strong> empties. And an unbounded chain of microtasks starves the loop entirely: a promise that reschedules itself will hang the page while the profiler shows plenty of idle time.</p>
<h2>await is scheduling, not blocking</h2>
<p>An <code>await</code> returns control to the caller immediately and schedules the remainder of the function as a microtask, so everything after the first <code>await</code> runs strictly later than the synchronous code that called it. Code that reads top to bottom is therefore split across at least two turns, which is why a variable read after an await may have been changed by something that ran in between.</p>
<aside class="tip"><code>this</code> is unrelated to scope. Ordinary functions receive <code>this</code> from how they are called, so extracting a method into a variable loses it. Arrow functions have no <code>this</code> of their own and close over the enclosing one, which is why they are the right choice for callbacks and the wrong choice for object methods.</aside>`,
      Advanced: `<p>Assume closures and the loop. The interesting questions are what a closure keeps alive, how ordering composes across microtask boundaries, and how the model differs between the browser and a server runtime.</p>
<h2>Closures and retention</h2>
<p>An engine captures the scope a function might reference, and optimisers narrow that to what it actually references, but the narrowing is not guaranteed and differs between engines. Two consequences matter in production. A small callback declared inside a scope that also holds a large buffer can keep that buffer reachable for the callback's whole lifetime, which is a classic leak in long lived event listeners. And a listener that is never removed keeps its entire captured environment alive along with any DOM node it references, which is why removal on teardown is not tidiness but memory correctness.</p>
<h2>Ordering guarantees worth knowing exactly</h2>
<ul>
<li>Each <code>await</code> costs at least one microtask tick, so awaiting an already resolved value still defers the continuation. Awaiting a value that is not a thenable is cheaper than awaiting a promise, but never free.</li>
<li>Microtasks are drained to exhaustion, so a chain that keeps scheduling itself prevents rendering and input handling indefinitely without ever appearing as CPU bound work in a naive profile.</li>
<li>Timers guarantee a minimum delay, not a scheduled time. Nested timers are clamped to about four milliseconds in browsers, and a busy main thread can delay them arbitrarily.</li>
<li>Node's loop has ordered phases and adds <code>process.nextTick</code>, which drains before promise microtasks. Ordering that holds in the browser can therefore differ on the server, which makes fine grained ordering a poor thing to depend on in shared code.</li>
</ul>
<h2>Keeping the main thread responsive</h2>
<p>Long work must be broken into pieces the <strong>call stack</strong> can finish, and the mechanism you choose changes the behaviour. Yielding through a microtask does not let the browser render, because rendering happens after microtasks are drained. Yielding through a task, historically a zero delay timer and now <code>scheduler.yield</code> where available, does. Work that is genuinely CPU bound belongs in a worker, and the cost of moving it there is the structured clone of everything you send, which is why transferable buffers exist.</p>
<aside class="tip">A test that relies on the difference between a microtask and a task passes for a reason you did not intend and will fail on another runtime. Wait for the observable condition rather than for a fixed number of ticks, and the same test will pass everywhere.</aside>`,
      Expert: `<p>The specification defines an agent with a single execution thread, a job queue set and a strict rule that a job runs to completion before another begins. Everything commonly described as concurrency in JavaScript is interleaving of jobs by that scheduler, which is why data races over shared memory do not exist here but logical races over shared state absolutely do.</p>
<h2>Environment records, not scope chains</h2>
<p>What a <strong>closure</strong> captures is an environment record, a mutable structure holding bindings, linked to its outer record. This is the mechanism behind several behaviours that appear inconsistent from the outside. Per iteration bindings in a <code>let</code> loop exist because the specification copies the loop environment on each iteration, an explicit step rather than an emergent property. A parameter list with a default expression creates a separate environment from the body, which is why a default value cannot see a variable declared with the same name in the body. <code>const</code> forbids rebinding the record entry, not mutation of the object it points at, which is a statement about the record and not about the value.</p>
<h2>Failure modes at the boundaries</h2>
<ul>
<li><strong>Unhandled rejection detection is heuristic.</strong> The runtime decides at the end of a microtask checkpoint whether a rejected promise has a handler, so attaching one in a later task turns a handled rejection into a reported crash on some configurations.</li>
<li><strong>Errors thrown in a microtask do not propagate to the surrounding frame.</strong> The frame that scheduled it has long since returned, which is precisely why a try block around code that starts an unawaited promise catches nothing.</li>
<li><strong>Starvation is invisible in coarse metrics.</strong> A recursive microtask chain keeps the thread perfectly busy while rendering never happens, and the diagnostic signal is the absence of frames rather than the presence of long tasks.</li>
<li><strong>Timer clamping is state dependent.</strong> Background tabs are throttled aggressively, so a polling loop built on timers changes frequency in ways that only appear from real user monitoring.</li>
</ul>
<h2>Designing around the model rather than against it</h2>
<p>Because a job runs to completion, any invariant you establish and consume within one synchronous block is safe without locking. Any invariant that must survive an <code>await</code> is exposed to every job that ran in the gap, so the durable pattern is to read once, compute, and then commit with a check that the world has not moved, exactly as optimistic concurrency works over HTTP. Treating <code>await</code> as a yield point you have to justify, rather than as a syntactic convenience, removes most of the class of bugs that people describe as impossible to reproduce.</p>
<aside class="tip">Order your reasoning by queue, not by line number. Write down which turn each piece of code runs in, and both the ordering surprises and the stale capture surprises resolve into the same two rules: bindings are captured by reference, and continuations run in a later turn than the code that scheduled them.</aside>`,
    },
    questions: [
      {
        n: 1,
        question:
          "What do the callbacks in a loop capture when the loop counter is declared with var and each callback is deferred?",
        options: [
          "A copy of the counter's value at the moment the callback was created",
          "The single shared binding, so every callback observes the final value",
          "A fresh binding per iteration, as with let",
          "Nothing, since var is not visible inside a nested function",
        ],
        answer: 1,
        explanation:
          "A closure captures the binding itself rather than a snapshot of its value, and var creates one function scoped binding for the whole loop, so all callbacks read the value it ended on. Assuming a copy is taken is the intuitive but wrong model, and it is exactly the assumption that makes the let version look mysterious rather than obvious.",
        difficulty: "Easy",
        skill: "Closure capture",
      },
      {
        n: 2,
        question:
          "A script logs A, schedules a promise callback logging B, schedules a zero delay timer logging C, then logs D. What is the output order?",
        options: ["A D B C", "A B C D", "A D C B", "A C B D"],
        answer: 0,
        explanation:
          "All synchronous code runs first, giving A then D, then the microtask queue is drained completely, giving B, and only then is one task taken from the task queue, giving C. Expecting C before B is the common error: a zero delay timer means as soon as the runtime is free, and the microtask queue is always drained before the next task.",
        difficulty: "Medium",
        skill: "Task and microtask queues",
      },
      {
        n: 3,
        question:
          "Reading a let variable before its declaration in the same block throws a ReferenceError. Why?",
        options: [
          "let declarations are not hoisted at all",
          "The binding exists but is uninitialised until the declaration runs, which is the temporal dead zone",
          "let is only valid at the top of a block",
          "The engine deletes the binding until it is needed",
        ],
        answer: 1,
        explanation:
          "The binding is created when the scope is entered but stays uninitialised until the declaration statement executes, and access during that interval throws by design. Saying let is not hoisted is the widespread shorthand, and it is wrong in a way that matters, since the binding does shadow an outer variable of the same name from the very top of the block.",
        difficulty: "Medium",
        skill: "Hoisting and the temporal dead zone",
      },
      {
        n: 4,
        question:
          "A method is extracted with const f = obj.method and then called as f(). What happens to this?",
        options: [
          "It still refers to obj, because the method was defined there",
          "It is undefined in strict mode, because this comes from the call site",
          "It refers to the enclosing lexical scope",
          "It throws a TypeError at extraction time",
        ],
        answer: 1,
        explanation:
          "An ordinary function receives this from how it is called, and a plain call supplies no receiver, so in strict mode this is undefined. Believing the binding travels with the function is the classic misconception; only an arrow function or an explicit bind gives that behaviour.",
        difficulty: "Medium",
        skill: "this binding",
      },
      {
        n: 5,
        question:
          "A promise chain that reschedules itself as a microtask on every completion makes the page unresponsive. Why does the profiler show little long task time?",
        options: [
          "Microtasks are executed on a background thread",
          "The queue is drained to exhaustion between tasks, so rendering and input never get a turn",
          "Microtasks have lower priority than rendering",
          "The profiler cannot record promise callbacks",
        ],
        answer: 1,
        explanation:
          "Rendering happens after the microtask queue empties, so a self replenishing chain keeps the loop busy with many short jobs and the browser never reaches the render step. Thinking microtasks run off the main thread is the tempting mistake: JavaScript has one execution thread, and every one of those jobs is on it.",
        difficulty: "Hard",
        skill: "Task and microtask queues",
      },
      {
        n: 6,
        question:
          "A long lived event listener declared inside a function that also created a large array keeps that array in memory. What is the mechanism?",
        options: [
          "Arrays are always retained until the page unloads",
          "The listener's closure keeps its captured scope reachable, so nothing in it can be collected",
          "The event system copies its arguments into a permanent registry",
          "Garbage collection is disabled while listeners are attached",
        ],
        answer: 1,
        explanation:
          "A closure holds its captured environment alive for as long as the function is reachable, and an attached listener is reachable until it is removed. Blaming the garbage collector is the tempting reading, but collection is working exactly as specified: the array is still reachable, so it is not garbage.",
        difficulty: "Hard",
        skill: "Closure capture",
      },
      {
        n: 7,
        question:
          "Why does code placed immediately after the first await in an async function never run in the same turn as the function's caller?",
        options: [
          "await blocks the thread until the value resolves",
          "await returns control to the caller and schedules the remainder as a microtask",
          "async functions always run on a worker thread",
          "The remainder is placed on the task queue behind timers",
        ],
        answer: 1,
        explanation:
          "await suspends the function, hands control back immediately, and queues the continuation as a microtask, so it runs after the caller's synchronous code completes. The idea that it blocks is the most damaging misconception in async JavaScript, since blocking would freeze the whole single threaded runtime.",
        difficulty: "Medium",
        skill: "Task and microtask queues",
      },
      {
        n: 8,
        question:
          "Which statement about lexical scope is correct?",
        options: [
          "A function resolves free variables using the scope of whoever called it",
          "A function resolves free variables using the scopes that physically enclose its definition",
          "Scope is decided at runtime from the this value",
          "Block scope applies to var as well as let",
        ],
        answer: 1,
        explanation:
          "Identifier resolution walks outwards through the scopes surrounding where the function was written, which is why moving a function to another file can break it while passing it around cannot. Resolution from the caller's scope is dynamic scoping, a different model that JavaScript does not use.",
        difficulty: "Easy",
        skill: "Lexical scope",
      },
    ],
  },

  5005: {
    topicId: 5005,
    title: "Promises, async/await and error propagation",
    summary:
      "Compose asynchronous work so that failures surface where they can be handled, and pick the right combinator for the job instead of awaiting everything in sequence.",
    concepts: [
      "Promise states",
      "Combinators",
      "Error propagation",
      "Cancellation",
      "Sequential versus concurrent",
      "Unhandled rejections",
    ],
    glossary: {
      Pending:
        "The state of a promise that has neither fulfilled nor rejected, from which exactly one transition is possible.",
      Settled:
        "A promise that has fulfilled with a value or rejected with a reason, after which its state can never change again.",
      Thenable:
        "Any object with a then method, which the promise machinery will adopt and resolve through.",
      "Promise.all":
        "A combinator that fulfils with every value in input order, or rejects immediately with the first rejection.",
      "Promise.allSettled":
        "A combinator that never rejects, fulfilling with a status record for every input in input order.",
      "Promise.any":
        "A combinator that fulfils with the first fulfilment and rejects only when every input rejects.",
      AbortController:
        "The standard way to signal cancellation, since a promise itself has no cancel operation.",
      "Unhandled rejection":
        "A rejected promise with no handler attached by the end of a microtask checkpoint, reported by the runtime as an error.",
    },
    body: {
      Beginner: `<p>A promise is an object that stands for a result you do not have yet. It has exactly three possible states and it can only move once: it starts <strong>pending</strong>, and it ends either fulfilled with a value or rejected with a reason. Once it has settled it never changes again.</p>
<h2>Two ways to read the same thing</h2>
<pre>getUser(7)
  .then(function (user) { console.log(user.name); })
  .catch(function (err) { console.log("failed", err.message); });</pre>
<p>and, saying the same thing in a shape that reads like ordinary code:</p>
<pre>try {
  const user = await getUser(7);
  console.log(user.name);
} catch (err) {
  console.log("failed", err.message);
}</pre>
<p>The second form is easier to read and it is the one to reach for. It does not make anything slower or faster on its own, it only changes how you write it.</p>
<h2>Waiting on one thing at a time is a choice</h2>
<p>If two pieces of work do not depend on each other, awaiting them one after the other means the second only starts when the first has finished. Starting both and then waiting for both is nearly always what you meant.</p>
<pre>const [user, orders] = await Promise.all([getUser(7), getOrders(7)]);</pre>
<aside class="tip">Every time you write two awaits in a row, ask whether the second line needs the first line's answer. If it does not, they should be running at the same time. This single habit removes most of the pointless waiting in a typical application.</aside>
<h2>Errors do not shout on their own</h2>
<p>If something goes wrong and nobody has attached a <code>catch</code>, the failure is not silent forever: the runtime reports it as an unhandled rejection. But it will not stop your program at the point of failure the way a thrown error does, so an operation you started and never waited for can fail without anything visible happening at the time.</p>`,
      Intermediate: `<p>Promises are a small state machine with a composition algebra on top. Learning the four combinators and where errors travel removes most asynchronous bugs before they are written.</p>
<h2>The state machine</h2>
<p>A promise is <strong>pending</strong> until it is settled, and settlement is a one way transition to fulfilled or rejected. Resolving a promise with another promise or any <strong>thenable</strong> adopts that object's eventual state rather than wrapping it, which is why <code>await</code> on a promise of a promise still yields the inner value. Handlers registered after settlement still run, on the next microtask, so there is no race in attaching a handler late.</p>
<h2>Choosing a combinator</h2>
<ul>
<li><code>Promise.all</code> fulfils with every value in input order and rejects on the first rejection. It is the right choice when you need all of it and any failure makes the whole operation pointless. It does not cancel the others; they run to completion unobserved.</li>
<li><code>Promise.allSettled</code> never rejects and reports each outcome individually. This is the right choice for a dashboard of independent widgets, where one failing panel must not blank the page.</li>
<li><code>Promise.any</code> fulfils with the first success and rejects only if every input fails, which suits redundant sources such as two mirrors of the same data.</li>
<li><code>Promise.race</code> settles with the first outcome of either kind, which makes it a timeout primitive rather than a redundancy primitive.</li>
</ul>
<h2>Where errors go</h2>
<p><strong>Error propagation</strong> through a promise chain follows one rule: a rejection travels down the chain until it meets a handler that takes a rejection, and a <code>catch</code> that returns a value converts the chain back to fulfilled from that point on. Inside an async function the mapping is direct, since a rejection becomes a thrown error at the await and an uncaught throw becomes a rejection of the function's own promise. Two mistakes account for most incidents: catching too early, which swallows a failure the caller needed to see, and catching too broadly, which turns a programming error such as a null dereference into a handled network failure.</p>
<h2>Concurrency has a cost too</h2>
<p>Firing a thousand requests with <code>Promise.all</code> is concurrency without a limit, and it will exhaust the browser's connection pool or your database's connection pool. A bounded worker pattern, a small number of workers pulling from a shared queue, keeps throughput high without the collapse. The general rule is that unbounded concurrency is a bug that only appears at scale.</p>
<aside class="tip">A promise cannot be cancelled. What you can cancel is the work behind it, which is what <strong>AbortController</strong> is for: pass its signal into fetch, and abort it when the component unmounts or a newer request supersedes this one. The promise still rejects, this time with an abort error, and you should ignore that specific reason rather than reporting it.</aside>`,
      Advanced: `<p>Assume the combinators. The difficult parts are error taxonomy, cancellation semantics and the ways a correct looking chain leaks work or reports failures in the wrong place.</p>
<h2>Rejections are not exceptions with a different spelling</h2>
<p>A rejection carries no stack from the point of the original call once it has crossed an await boundary in some engines, and it is detected as unhandled only at a microtask checkpoint. Three consequences follow. Attaching a handler in a later task to a promise that already rejected can still trigger an <strong>unhandled rejection</strong> report. Starting a promise and awaiting it later means the interval between is unprotected. And a <code>try</code> block around a call that is not awaited catches nothing at all, because the frame has returned before the failure exists.</p>
<h2>Cancellation is cooperative</h2>
<p>Nothing in the promise specification stops work in flight, so <strong>cancellation</strong> is a protocol you implement. A signal from an <strong>AbortController</strong> must be threaded all the way through: into the fetch, into any nested calls, and checked between stages of a multi step operation. Two disciplines make it reliable: treat an abort reason as a non error to be swallowed at the boundary rather than reported, and make aborting idempotent so a component that unmounts twice does not raise. In request driven code the same signal also gives you last write wins, since superseding a request means aborting the previous one before issuing the new one.</p>
<h2>Patterns worth having in the toolbox</h2>
<ul>
<li><strong>Timeout by race.</strong> Race the real work against a timer that rejects, and abort the real work in a finally clause so the losing branch does not continue consuming a connection.</li>
<li><strong>Retry with jitter.</strong> Retry only idempotent operations, back off exponentially, and add randomness so that a thousand clients recovering from an outage do not synchronise into a second outage.</li>
<li><strong>Single flight.</strong> Cache the in flight promise by key so that ten components asking for the same resource at once produce one request, and delete the entry on settlement so a failure is not cached forever.</li>
<li><strong>Bounded map.</strong> Replace <code>Promise.all</code> over a large array with a pool of fixed size, because <strong>sequential versus concurrent</strong> is not a binary choice.</li>
</ul>
<aside class="tip">Distinguish expected failures from defects at the boundary of your code. Convert a rejected fetch into a typed result your caller must handle, and let a TypeError from your own bug propagate to the top level reporter. A catch block that treats both alike is how a null dereference is served to users as a friendly connection problem message for a year.</aside>`,
      Expert: `<p>Promises are a monadic value with an eager producer and a deferred consumer, and nearly every subtle problem traces to that asymmetry: the work starts when the promise is created, while the decision about how to handle its outcome is taken later and possibly never.</p>
<h2>Resolution is a protocol, not an assignment</h2>
<p>Resolving with a <strong>thenable</strong> invokes its <code>then</code> method with resolve and reject functions, and the specification requires that this call be scheduled rather than performed synchronously, that the thenable's <code>then</code> be read exactly once, and that only the first call to either function take effect. That is why adopting a promise costs an extra microtask tick and why a hostile or buggy thenable cannot settle a promise twice. It is also why a value that merely looks like a promise, an object with an unrelated <code>then</code> property, will be treated as one and hang a chain permanently.</p>
<h2>What the guidance usually omits</h2>
<ul>
<li><strong>Promise.all does not cancel siblings.</strong> On the first rejection the aggregate settles while every other operation continues to completion, holding connections and possibly writing data. Aggregating without a shared abort signal is a resource leak that only shows under failure.</li>
<li><strong>Promise.any aggregates errors, race does not.</strong> Reaching for race as a redundancy mechanism produces a system whose behaviour on a fast failure is to fail fast, the exact opposite of the intent.</li>
<li><strong>Async functions always allocate.</strong> Marking a hot synchronous function async to make a signature uniform imposes a promise allocation and a microtask tick per call, which is measurable in tight loops and invisible in benchmarks that await the result anyway.</li>
<li><strong>Unhandled rejection is a heuristic about your code, not a rule about promises.</strong> Node can be configured to treat it as fatal and browsers report it to the error handler, so a library that intentionally creates a promise it does not observe is imposing a policy decision on its host.</li>
</ul>
<h2>Structuring long lived asynchronous work</h2>
<p>Once operations outlive a single call, the useful model is structured concurrency: every started operation has an owner responsible for awaiting or aborting it, and no operation outlives its owner. Implemented plainly, that means a scope object holding an <strong>AbortController</strong> and a set of pending promises, with teardown that aborts the controller and awaits settlement. It removes the two failure modes that dominate real applications, orphaned work continuing after the thing that wanted it is gone, and failures reported after the context needed to interpret them has been discarded.</p>
<aside class="tip">Design the failure path first. Decide for each operation whether the correct behaviour is retry, degrade or fail loudly, and write that decision into the type your function returns. <strong>Error propagation</strong> that has to be inferred from where somebody happened to put a catch is not a design, and it will differ in every call site.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Predict what a combinator settles to",
        difficulty: "Medium",
        statement: `<p>Promise combinators differ only in how they read a set of outcomes, so you can model them without any asynchrony at all.</p>
<p>You receive a combinator name and an array of tasks. Each task is <code>{ t, status, value }</code> or <code>{ t, status, reason }</code>, where <code>t</code> is the millisecond at which that task settles and <code>status</code> is <code>"fulfilled"</code> or <code>"rejected"</code>. When two tasks share a <code>t</code>, the earlier one in the array settles first.</p>
<p>Return the settled state of the combined promise as <code>{ status, value }</code> or <code>{ status, reason }</code>:</p>
<ul>
<li><code>"all"</code>: rejects with the reason of the first rejection to settle, otherwise fulfils with every value <em>in input order</em>.</li>
<li><code>"allSettled"</code>: always fulfils with one record per task in input order, each being <code>{ status, value }</code> or <code>{ status, reason }</code>.</li>
<li><code>"any"</code>: fulfils with the value of the first fulfilment to settle, otherwise rejects with an array of every reason in input order.</li>
<li><code>"race"</code>: settles exactly as the first task to settle, whatever its status.</li>
</ul>
<p>With an empty task list, <code>"all"</code> and <code>"allSettled"</code> fulfil with an empty array, <code>"any"</code> rejects with an empty array, and <code>"race"</code> never settles, for which you should return <code>{ status: "pending" }</code>.</p>`,
        fn: "combine",
        params: "kind, tasks",
        tests: [
          {
            args: [
              "all",
              [
                { t: 30, status: "fulfilled", value: "a" },
                { t: 10, status: "fulfilled", value: "b" },
              ],
            ],
            expected: { status: "fulfilled", value: ["a", "b"] },
            label: "all keeps input order",
          },
          {
            args: [
              "all",
              [
                { t: 30, status: "rejected", reason: "late" },
                { t: 10, status: "rejected", reason: "early" },
                { t: 20, status: "fulfilled", value: "x" },
              ],
            ],
            expected: { status: "rejected", reason: "early" },
            label: "all rejects with the first rejection by time",
          },
          {
            args: [
              "race",
              [
                { t: 5, status: "rejected", reason: "boom" },
                { t: 1, status: "fulfilled", value: "quick" },
              ],
            ],
            expected: { status: "fulfilled", value: "quick" },
            label: "race takes whichever settles first",
          },
          {
            args: [
              "any",
              [
                { t: 5, status: "rejected", reason: "r1" },
                { t: 9, status: "rejected", reason: "r2" },
              ],
            ],
            expected: { status: "rejected", reason: ["r1", "r2"] },
            label: "any aggregates every reason",
          },
          {
            args: [
              "allSettled",
              [
                { t: 2, status: "fulfilled", value: 1 },
                { t: 1, status: "rejected", reason: "no" },
              ],
            ],
            expected: {
              status: "fulfilled",
              value: [
                { status: "fulfilled", value: 1 },
                { status: "rejected", reason: "no" },
              ],
            },
            label: "allSettled never rejects",
          },
          {
            args: ["race", []],
            expected: { status: "pending" },
            label: "race with nothing to race",
            hidden: true,
          },
          {
            args: [
              "any",
              [
                { t: 7, status: "fulfilled", value: "mirror-b" },
                { t: 7, status: "fulfilled", value: "mirror-a" },
              ],
            ],
            expected: { status: "fulfilled", value: "mirror-b" },
            label: "ties break on input order",
          },
        ],
        hints: [
          "Two orderings are in play and only one of them is by time. Build a time sorted view for deciding which task wins, and keep the original array for anything reported in input order.",
          "A stable sort on time is not enough by itself: compare the original index when two times are equal.",
          "Handle the empty list per combinator before the general path, since three of the four have a defined answer and only race does not settle.",
        ],
        solution: `function combine(kind, tasks) {
  var byTime = tasks
    .map(function (task, index) { return { task: task, index: index }; })
    .sort(function (a, b) {
      if (a.task.t !== b.task.t) return a.task.t - b.task.t;
      return a.index - b.index;
    });

  if (kind === "race") {
    if (byTime.length === 0) return { status: "pending" };
    var first = byTime[0].task;
    if (first.status === "fulfilled") return { status: "fulfilled", value: first.value };
    return { status: "rejected", reason: first.reason };
  }

  if (kind === "all") {
    for (var i = 0; i < byTime.length; i++) {
      if (byTime[i].task.status === "rejected") {
        return { status: "rejected", reason: byTime[i].task.reason };
      }
    }
    return {
      status: "fulfilled",
      value: tasks.map(function (task) { return task.value; })
    };
  }

  if (kind === "any") {
    for (var j = 0; j < byTime.length; j++) {
      if (byTime[j].task.status === "fulfilled") {
        return { status: "fulfilled", value: byTime[j].task.value };
      }
    }
    return {
      status: "rejected",
      reason: tasks.map(function (task) { return task.reason; })
    };
  }

  return {
    status: "fulfilled",
    value: tasks.map(function (task) {
      if (task.status === "fulfilled") return { status: "fulfilled", value: task.value };
      return { status: "rejected", reason: task.reason };
    })
  };
}`,
        skills: ["Combinators", "Promise states", "Error propagation"],
      },
    ],
  },

  5006: {
    topicId: 5006,
    title: "Typing real data: unions, guards and generics",
    summary:
      "Model data that arrives from outside your program so the compiler stops you writing impossible states, and validate at the boundary so a type is a claim you have actually checked.",
    concepts: [
      "Discriminated unions",
      "Type guards and narrowing",
      "Generics and constraints",
      "Boundary validation",
      "Structural typing",
      "Exhaustiveness checking",
    ],
    glossary: {
      "Discriminated union":
        "A union of object types that share a literal field, so checking that field tells the compiler exactly which member you are holding.",
      Narrowing:
        "The compiler's progressive reduction of a value's type as control flow proves possibilities impossible.",
      "Type predicate":
        "A function whose return type is written as value is Something, which teaches the compiler to narrow based on a runtime check you wrote.",
      "Structural typing":
        "TypeScript's rule that compatibility is decided by shape rather than by declared inheritance.",
      unknown:
        "The safe counterpart of any: it accepts every value but permits no operation until you narrow it.",
      "Exhaustiveness check":
        "Assigning the remaining value to never in a default branch, so adding a union member becomes a compile error at every switch that handles it.",
      "Generic constraint":
        "The extends clause on a type parameter, which limits what may be substituted and unlocks operations inside the generic body.",
    },
    body: {
      Beginner: `<p>Types are not decoration. They are a description of what your data can be, checked before the program runs. The value is highest exactly where data is messy: forms, network responses, anything a person typed.</p>
<h2>Union types say or</h2>
<p>A value that can be one of several shapes is a union. Adding a shared label field turns it into something the compiler can reason about.</p>
<pre>type Event =
  | { kind: "click"; x: number; y: number }
  | { kind: "keypress"; key: string };</pre>
<p>Now writing <code>if (event.kind === "click")</code> tells the compiler, inside that block, that <code>x</code> and <code>y</code> exist and <code>key</code> does not. That shared label is called the discriminant, and this is the single most useful pattern in the language.</p>
<h2>Checking before trusting</h2>
<p>Data from a network call arrives as whatever the server sent. Writing a type annotation on it does not check anything; it only tells the compiler to stop asking. If you want a claim that is actually true, you must test it at runtime.</p>
<pre>function isUser(value) {
  return typeof value === "object"
    &amp;&amp; value !== null
    &amp;&amp; typeof value.name === "string";
}</pre>
<aside class="tip">The word <code>any</code> switches the checker off for that value and everything it touches. Prefer <code>unknown</code>, which also accepts anything but refuses to let you use it until you have proved what it is. It is the difference between a locked door and no door.</aside>
<h2>Generics say the same shape, whatever it holds</h2>
<p>A function that returns the first item of a list works for any list, and you want the result type to follow the input.</p>
<pre>function first&lt;T&gt;(items: T[]): T | undefined {
  return items[0];
}</pre>
<p>Call it with numbers and you get a number or undefined. Call it with users and you get a user or undefined. One implementation, honest types at every call site.</p>`,
      Intermediate: `<p>The purpose of a type system in application code is to make illegal states unrepresentable, and to force a check at the exact point where trust is transferred from the outside world into your program.</p>
<h2>Discriminated unions replace optional soup</h2>
<p>A request state modelled as <code>{ loading: boolean; data?: T; error?: Error }</code> has eight combinations, of which three are meaningful. Every consumer must then defend against states the code can never produce, and defending inconsistently is where the render bugs live. A <strong>discriminated union</strong> of <code>{ status: "idle" }</code>, <code>{ status: "loading" }</code>, <code>{ status: "success"; data: T }</code> and <code>{ status: "error"; error: Error }</code> has exactly four, all meaningful, and the compiler will not allow a read of <code>data</code> outside the success branch.</p>
<h2>Narrowing and your own guards</h2>
<p><strong>Narrowing</strong> happens automatically from <code>typeof</code>, <code>instanceof</code>, truthiness, equality against a literal and the <code>in</code> operator. When your check is more involved, a <strong>type predicate</strong> lets you extend the mechanism yourself:</p>
<pre>function isOrder(value: unknown): value is Order {
  return typeof value === "object" &amp;&amp; value !== null &amp;&amp; "orderId" in value;
}</pre>
<p>The compiler now trusts the body of that function absolutely, which is the trade: a predicate is an assertion you are responsible for keeping true. A predicate whose body is wrong is worse than a cast, because it looks like verification.</p>
<h2>Generics and constraints</h2>
<p>A bare type parameter tells you nothing about what you can do with the value, which is the point. Add a <strong>generic constraint</strong> when the body needs to know something:</p>
<pre>function byId&lt;T extends { id: string }&gt;(items: T[]): Record&lt;string, T&gt; {
  const out: Record&lt;string, T&gt; = {};
  for (const item of items) out[item.id] = item;
  return out;
}</pre>
<p>The constraint permits the property access inside, and the return type stays specific to whatever the caller passed. The common misuse is a parameter used only once in the signature, which is not generic at all and should simply be the constraint's type.</p>
<h2>Validate once, at the boundary</h2>
<p><strong>Boundary validation</strong> means parsing untrusted input into a known type at the single point where it enters, then trusting it inside. A parse function that takes <code>unknown</code> and returns either a typed value or an error is the whole pattern, and it eliminates the defensive checks that otherwise accumulate in every consumer.</p>
<aside class="tip">Add an <strong>exhaustiveness check</strong> to every switch over a union: in the default branch, assign the value to a variable typed <code>never</code>. When someone adds a new union member, every switch that forgot to handle it fails to compile, which turns a silent runtime gap into a build error.</aside>`,
      Advanced: `<p>Assume unions, guards and generics. What is worth attention is where the type system's guarantees stop, and how to arrange code so the gaps are few and visible.</p>
<h2>The type system is erased and structural</h2>
<p>No type information exists at runtime, so every guarantee is about code you compiled and none of it constrains data arriving over a socket. <strong>Structural typing</strong> compounds this: a value with the right shape satisfies a type it has never heard of, which is convenient until you want two types with identical shapes to be incompatible. Branded types solve that by intersecting with a phantom field, so an <code>OrderId</code> cannot be passed where a <code>UserId</code> is expected even though both are strings at runtime. The brand costs one cast at the point of creation, which is precisely where the validation lives anyway.</p>
<h2>Where soundness is deliberately traded away</h2>
<ul>
<li>Array index access is typed as the element type, not as element or undefined, unless <code>noUncheckedIndexedAccess</code> is on. Most codebases carry this hole without knowing it.</li>
<li>Method parameters are compared bivariantly for compatibility, so an override accepting a narrower parameter type is accepted despite being unsound. Properties declared with function type syntax are checked strictly instead.</li>
<li>A type assertion is an instruction to stop checking, not a conversion. Every assertion is a place a runtime failure can originate, which is why they belong at boundaries and nowhere else.</li>
<li>Excess property checks apply to object literals only, so passing the same object through a variable silently permits extra fields.</li>
</ul>
<h2>Generic design that stays usable</h2>
<p>Inference works best when type parameters appear in parameter positions and are inferred from arguments rather than supplied explicitly. Two techniques carry a lot of weight: conditional types with <code>infer</code> to extract a piece of a shape, and mapped types with key remapping to derive one type from another so they cannot drift apart. The counterweight is comprehensibility. A signature that requires the reader to evaluate three conditional types to know what comes back will be worked around rather than used, and a hover tooltip that fills the screen is a design smell rather than a badge of sophistication.</p>
<aside class="tip">Derive your types from your validators rather than declaring both. When the schema is the single source of truth and the static type is inferred from it, the compile time claim and the runtime check cannot disagree, which is the failure mode <strong>boundary validation</strong> exists to prevent in the first place.</aside>`,
      Expert: `<p>TypeScript is a structural, gradually typed, deliberately unsound checker over JavaScript semantics. Every design decision follows from those words, and reading the language that way explains both its ergonomics and the places where a guarantee turns out to be a convention.</p>
<h2>Narrowing is control flow analysis over a lattice</h2>
<p>The checker maintains a per binding type at each point in the control flow graph, meeting and joining as branches diverge and merge. This is why <strong>narrowing</strong> is lost across a closure boundary, since the compiler cannot prove when the closure runs relative to the assignment, and why narrowing on a mutable property is discarded after any function call that could reach it. Assigning the property to a <code>const</code> restores the guarantee, not as a workaround but because it moves the value into a binding whose immutability the checker can actually verify. Discriminant based narrowing is the special case where the meet operation is exact, which is why <strong>discriminated unions</strong> outperform every other modelling technique in practice.</p>
<h2>What the documentation understates</h2>
<ul>
<li><strong>A type predicate is an unchecked axiom.</strong> The compiler verifies that the return type is boolean and takes the rest on faith. A codebase's real soundness boundary is the set of its predicates and assertions, and that set is worth reviewing as a unit.</li>
<li><strong>Excess property checking is a heuristic, not a rule of the type system.</strong> It exists to catch typos in literals and disappears the moment a value is aliased, so it must never be relied on as a defence against extra data.</li>
<li><strong>Conditional types distribute over naked type parameters.</strong> A conditional that looks like a filter silently maps over each union member, and wrapping the parameter in a tuple to disable distribution is the difference between a working utility and one that quietly returns a union you did not intend.</li>
<li><strong>Enum members are nominal, and const enums are erased.</strong> The result is that enums behave unlike every other construct in the language, which is why union of string literal types is the more predictable default.</li>
</ul>
<h2>Types as a design instrument</h2>
<p>The highest leverage use of the system is not catching typos, it is constraining the shape of state so entire categories of bug cannot be expressed. A parser that returns a branded type says that no unvalidated value can flow into the domain, enforced everywhere for the cost of one function. A union of states says that no component can render a loading spinner and an error simultaneously, enforced everywhere for the cost of one type. Both replace runtime defence with structure, and the resulting code is shorter because the impossible cases are simply absent rather than handled.</p>
<aside class="tip">Turn on <code>strict</code>, <code>noUncheckedIndexedAccess</code> and <code>exactOptionalPropertyTypes</code> at the start of a project and never afterwards. Retrofitting them is measured in weeks because every one of them exposes real defects, and a codebase that adopted them late tends to sprinkle assertions rather than fix the modelling that made them necessary.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Validate a discriminated union at the boundary",
        difficulty: "Medium",
        statement: `<p>A static type is only a claim until something checks it. Implement the runtime half of a discriminated union: a boundary validator that separates well formed events from malformed ones.</p>
<p>You are given an array of schemas, each shaped <code>{ kind, fields }</code> where <code>fields</code> maps a field name to a required type name, and an array of untrusted values.</p>
<p>Return <code>{ kept, rejected }</code>, where <code>kept</code> holds the accepted values in input order and <code>rejected</code> holds <code>{ index, reason }</code> records in input order. Apply the checks in this order and report only the first failure per value:</p>
<ul>
<li>If the value is not a non null object, or is an array, or its <code>kind</code> is not a string, the reason is <code>"not an event"</code>.</li>
<li>If no schema has that <code>kind</code>, the reason is <code>"unknown kind: "</code> followed by the kind.</li>
<li>Otherwise check each field in the order the schema declares it. The observed type is <code>"array"</code> for an array, <code>"null"</code> for null, and <code>typeof</code> otherwise, so a missing field observes as <code>"undefined"</code>. On a mismatch the reason is <code>"field NAME expected WANTED but got OBSERVED"</code>.</li>
</ul>
<p>For example, an event missing a numeric <code>x</code> produces the reason <code>field x expected number but got undefined</code>.</p>`,
        fn: "partitionEvents",
        params: "schemas, events",
        tests: [
          {
            args: [
              [{ kind: "click", fields: { x: "number", y: "number" } }],
              [{ kind: "click", x: 1, y: 2 }],
            ],
            expected: { kept: [{ kind: "click", x: 1, y: 2 }], rejected: [] },
            label: "basic accept",
          },
          {
            args: [
              [
                { kind: "click", fields: { x: "number", y: "number" } },
                { kind: "keypress", fields: { key: "string" } },
              ],
              [
                { kind: "keypress", key: "Enter" },
                { kind: "click", x: 1 },
                { kind: "scroll", top: 0 },
                null,
              ],
            ],
            expected: {
              kept: [{ kind: "keypress", key: "Enter" }],
              rejected: [
                { index: 1, reason: "field y expected number but got undefined" },
                { index: 2, reason: "unknown kind: scroll" },
                { index: 3, reason: "not an event" },
              ],
            },
            label: "mixed batch",
          },
          {
            args: [
              [{ kind: "tag", fields: { labels: "array", meta: "object" } }],
              [
                { kind: "tag", labels: ["a"], meta: {} },
                { kind: "tag", labels: "a", meta: {} },
                { kind: "tag", labels: [], meta: null },
              ],
            ],
            expected: {
              kept: [{ kind: "tag", labels: ["a"], meta: {} }],
              rejected: [
                { index: 1, reason: "field labels expected array but got string" },
                { index: 2, reason: "field meta expected object but got null" },
              ],
            },
            label: "array and null are their own observed types",
          },
          {
            args: [[{ kind: "click", fields: { x: "number" } }], []],
            expected: { kept: [], rejected: [] },
            label: "empty input",
          },
          {
            args: [
              [{ kind: "ping", fields: {} }],
              [{ kind: "ping" }, ["kind"], 42, { kind: 7 }],
            ],
            expected: {
              kept: [{ kind: "ping" }],
              rejected: [
                { index: 1, reason: "not an event" },
                { index: 2, reason: "not an event" },
                { index: 3, reason: "not an event" },
              ],
            },
            label: "arrays, primitives and non string discriminants",
            hidden: true,
          },
        ],
        hints: [
          "Index the schemas by kind once before the loop, otherwise you are scanning the schema list for every value you check.",
          "The observed type needs three special cases before typeof is useful: an array reports as object, null reports as object, and a missing field reports as undefined.",
          "Stop at the first failing field so the reason is deterministic, and remember that Object.keys preserves the declaration order of the schema's fields.",
        ],
        solution: `function partitionEvents(schemas, events) {
  var byKind = {};
  for (var s = 0; s < schemas.length; s++) {
    byKind[schemas[s].kind] = schemas[s].fields || {};
  }

  function observedType(value) {
    if (Array.isArray(value)) return "array";
    if (value === null) return "null";
    return typeof value;
  }

  var kept = [];
  var rejected = [];

  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    if (event === null || typeof event !== "object" || Array.isArray(event) || typeof event.kind !== "string") {
      rejected.push({ index: i, reason: "not an event" });
      continue;
    }
    var fields = byKind[event.kind];
    if (!fields) {
      rejected.push({ index: i, reason: "unknown kind: " + event.kind });
      continue;
    }
    var names = Object.keys(fields);
    var failure = null;
    for (var f = 0; f < names.length; f++) {
      var name = names[f];
      var actual = observedType(event[name]);
      if (actual !== fields[name]) {
        failure = "field " + name + " expected " + fields[name] + " but got " + actual;
        break;
      }
    }
    if (failure) rejected.push({ index: i, reason: failure });
    else kept.push(event);
  }

  return { kept: kept, rejected: rejected };
}`,
        skills: ["Discriminated unions", "Boundary validation", "Type guards and narrowing"],
      },
    ],
  },

  5007: {
    topicId: 5007,
    title: "Immutability and why state bugs hide there",
    summary:
      "See why shared mutable objects produce bugs that survive every unit test, and learn the update patterns that keep change detection, undo and time travel debugging honest.",
    concepts: [
      "Reference versus value",
      "Shallow copy",
      "Structural sharing",
      "Referential equality",
      "Defensive copying",
      "Persistent updates",
    ],
    glossary: {
      "Reference equality":
        "Comparison by identity, which is what the triple equals operator does for objects and what React and memoisation rely on.",
      "Shallow copy":
        "A new container whose entries still point at the original nested objects, so mutating one of them is visible through both copies.",
      "Deep copy":
        "A recursive duplicate in which no nested object is shared with the original.",
      "Structural sharing":
        "Producing a new version by copying only the path to the change and reusing every untouched subtree.",
      "Object.freeze":
        "A shallow runtime lock that prevents adding, removing or changing a direct property, silently in sloppy mode and with a throw in strict mode.",
      Aliasing:
        "Two names referring to the same object, which is what makes a mutation in one place appear in an unrelated one.",
      "Persistent data structure":
        "A structure whose previous versions remain valid after an update, which is what makes undo and time travel possible.",
    },
    body: {
      Beginner: `<p>Numbers and strings are copied when you assign them. Objects and arrays are not. Assigning an object copies the arrow that points at it, not the thing itself, and this single fact is behind an enormous share of confusing bugs.</p>
<pre>const a = { total: 10 };
const b = a;
b.total = 99;
console.log(a.total); // 99</pre>
<p>There was only ever one object. <code>a</code> and <code>b</code> are two names for it, which is called <strong>aliasing</strong>.</p>
<h2>Copying instead of changing</h2>
<p>The safe habit is to build a new object rather than edit the one you were given.</p>
<pre>const updated = { ...original, total: 99 };
const withItem = [...list, newItem];
const without = list.filter(function (x) { return x.id !== 3; });</pre>
<p>Notice which array methods change the original: <code>push</code>, <code>pop</code>, <code>splice</code>, <code>sort</code> and <code>reverse</code> all mutate. <code>map</code>, <code>filter</code>, <code>slice</code> and <code>concat</code> all return something new. Sorting is the one people forget, because <code>list.sort()</code> looks like it returns a sorted copy and actually reorders the original in place.</p>
<aside class="tip">The spread operator copies only one level deep. <code>{ ...user }</code> gives you a new user object whose <code>address</code> is still the very same address object as before. Change the address through either name and both see it.</aside>
<h2>Why frameworks care</h2>
<p>Interface libraries decide whether to redraw by asking a very cheap question: is this the same object as last time? If you changed the contents without changing the object, the answer is yes, and nothing redraws even though the data is different. Creating a new object is what tells the framework something happened.</p>`,
      Intermediate: `<p>Immutability is not a moral position about mutation. It is a technique for making change detectable in constant time, which is what modern interface libraries, memoisation and undo all depend on.</p>
<h2>The cost model</h2>
<p>Comparing two objects deeply costs time proportional to their size. Comparing two references costs a single machine comparison. If every update produces a new object for the parts that changed and reuses the objects that did not, then <strong>referential equality</strong> becomes a sound and extremely cheap test for did this change. That is the entire bargain, and every rule below is in service of it.</p>
<h2>Shallow copy is where correctness leaks</h2>
<p>A <strong>shallow copy</strong> is correct only if you change nothing below the top level. Updating a nested value therefore means copying every container on the path to it:</p>
<pre>const next = {
  ...state,
  user: {
    ...state.user,
    address: { ...state.user.address, city: "Bristol" }
  }
};</pre>
<p>Everything not on that path, including the entire order history, is reused by reference. That is <strong>structural sharing</strong>: the new version costs the depth of the path rather than the size of the tree, and old versions remain valid, which is what makes undo trivial.</p>
<h2>Arrays need the same discipline</h2>
<ul>
<li>Replace one element with <code>map</code>, returning the original object for every index you are not changing.</li>
<li>Insert with <code>slice</code> on both sides, or <code>toSpliced</code> where it is available.</li>
<li>Sort with a copy first, because <code>sort</code> reorders in place and will mutate state you are holding.</li>
<li>Remember that <code>reverse</code> mutates too, and that a reversed list rendered from state is a common source of a list that scrambles itself over time.</li>
</ul>
<h2>Boundaries deserve defensive copies</h2>
<p><strong>Defensive copying</strong> means never handing out or storing a reference to a mutable object you do not control. A getter that returns an internal array lets any caller push into your state. A constructor that stores a caller's array lets the caller change your object later. One copy at each boundary removes an entire class of action at a distance, and it costs nothing on the small objects most application code deals in.</p>
<aside class="tip">Watch for the mutation that happens before the copy. <code>const next = { ...state }; next.items.push(item);</code> creates a new outer object and then mutates the original array, so change detection sees a new state while every previous version has been corrupted. It is the most common way an immutable update is written incorrectly.</aside>`,
      Advanced: `<p>Assume the copying patterns. The interesting questions are enforcement, performance at scale and the failure modes that only appear when several copies of the same data exist in one process.</p>
<h2>Enforcement options and what each really buys</h2>
<p><code>Object.freeze</code> is shallow and its violations are silent outside strict mode, so it is a development time assertion rather than a guarantee. Deep freezing in development only, behind an environment check, catches accidental mutation at the point it happens instead of at the point the interface fails to update, which is usually many frames later. TypeScript's <code>readonly</code> and <code>Readonly</code> are compile time only and disappear entirely for data arriving over the network. A producer style library that gives you a draft and returns a structurally shared result is the practical middle ground, because the ergonomics of mutation are preserved while the output is a new version.</p>
<h2>Where naive immutability becomes the bottleneck</h2>
<ul>
<li>Copying a large array on every keystroke is quadratic over a session. Normalise to a keyed map so an update copies one entry and the map's spine rather than every element.</li>
<li>Deriving a sorted or filtered array in a render body allocates a new array each time, which defeats every downstream memoisation because the reference changes even when the contents do not.</li>
<li>Deep cloning to be safe converts a cheap update into a full traversal and, worse, destroys <strong>structural sharing</strong>, so every memoised consumer recomputes.</li>
<li>Freezing very large structures is itself a traversal, and it makes the objects slower to access in some engines.</li>
</ul>
<h2>Identity as a design decision</h2>
<p>Once <strong>referential equality</strong> is load bearing, object identity becomes part of your interface. Two rules keep it coherent. Do not create a new object for data that has not changed, since a fresh empty array literal on every call is a change as far as every consumer is concerned. And do not reuse an object for data that has changed, which is the mutation case. Both violations produce the same symptom class, an interface that updates when it should not or fails to update when it should, and both are diagnosed by asking whether the reference changed exactly when the value did.</p>
<aside class="tip">Structural sharing is what makes time travel debugging affordable. Keeping the last fifty states costs the sum of the changed paths, not fifty full copies, so an application with immutable updates gets undo, redo and a replayable bug report for almost nothing. An application built on mutation cannot retrofit any of the three.</aside>`,
      Expert: `<p>The deep argument for immutability is not about avoiding bugs, it is about restoring equational reasoning. If a value cannot change under you, a function's result depends only on its arguments, caching is sound, and concurrent readers need no coordination. JavaScript gives you none of that by default, so every technique here is a way of buying back a property the language does not provide.</p>
<h2>Persistent structures and the real complexity</h2>
<p>Hand written spread updates give you path copying, which is linear in depth for a tree and linear in width for a plain array or object, since the spine itself is copied. Library <strong>persistent data structures</strong> use a wide branching trie, typically thirty two ways, so update, lookup and iteration are effectively constant in practice while sharing everything untouched. The trade is a boundary cost: values must be converted at the edges, and any interoperation with code expecting plain objects pays for that conversion, often exceeding the savings in an application whose state is measured in kilobytes rather than megabytes.</p>
<h2>Subtleties that bite in production</h2>
<ul>
<li><strong>structuredClone is not a deep copy of everything.</strong> It preserves cycles, Maps, Sets and dates, and it throws on functions, class instances lose their prototype, and getters are materialised as values. Silent loss of behaviour is the failure mode, not an exception.</li>
<li><strong>Frozen does not mean unchanging.</strong> A frozen object holding a mutable array is frozen only in the sense that the property cannot be reassigned. Recursive freezing is the only meaningful assertion, and it must skip typed arrays and anything with an internal slot.</li>
<li><strong>Equality of derived values is the real memoisation boundary.</strong> Selectors that build a new array on each call break every downstream comparison, which is why memoised selectors exist and why their cache size defaults being one is a correctness detail rather than a tuning knob.</li>
<li><strong>Immutability does not confer atomicity.</strong> Read modify write across an await still loses updates, because the read happened in a different turn. The immutable value merely guarantees that the version you read did not change under you, not that it is still current.</li>
</ul>
<h2>Choosing where to be strict</h2>
<p>Apply immutability where identity is load bearing, which means anything stored in a state container, passed as a component prop, used as a memoisation input or retained across turns of the event loop. Local scratch data inside a function has no observers, so mutating an accumulator in a tight loop is both faster and perfectly safe. Confusing the two produces either a codebase that allocates constantly for no benefit, or one that is immutable everywhere except the one place a stale reference is still held.</p>
<aside class="tip">When an interface fails to update, ask one question before anything else: did the reference change. If it did not, someone mutated. If it did and the value is identical, something is allocating a fresh object where it should have reused one. Nearly every bug in this area answers to one of those two sentences.</aside>`,
    },
    questions: [
      {
        n: 1,
        question:
          "After const b = a where a is an object, changing b.total also changes a.total. Why?",
        options: [
          "Objects are copied by value, and the copy was linked back",
          "Assignment copied the reference, so both names point at one object",
          "Only const bindings behave this way; let would copy",
          "The engine caches object literals and reuses them",
        ],
        answer: 1,
        explanation:
          "Assigning an object copies the reference rather than the object, so there is one object with two names, which is aliasing. The idea that const causes it is a common confusion: const restricts rebinding the name, and says nothing at all about mutating the value it points at.",
        difficulty: "Easy",
        skill: "Reference versus value",
      },
      {
        n: 2,
        question:
          "Which of these array methods returns a new array rather than modifying the original?",
        options: ["sort", "splice", "filter", "reverse"],
        answer: 2,
        explanation:
          "filter builds and returns a new array, while sort, splice and reverse all operate in place. sort is the trap in this list because it also returns the array, so code that reads like a copy is in fact reordering the state you were holding.",
        difficulty: "Easy",
        skill: "Persistent updates",
      },
      {
        n: 3,
        question:
          "const next = { ...state }; next.items.push(item); What is wrong with this update?",
        options: [
          "Nothing, a shallow copy is sufficient for a nested array",
          "The outer object is new but items is the original array, so previous versions are corrupted",
          "push does not exist on a spread array",
          "The spread operator already deep copies, making the push redundant",
        ],
        answer: 1,
        explanation:
          "A spread copies one level, so next.items is the very same array as state.items and pushing into it mutates every version that shares it. Believing spread is a deep copy is the single most common cause of state that looks updated to change detection while older snapshots have silently changed too.",
        difficulty: "Medium",
        skill: "Shallow copy",
      },
      {
        n: 4,
        question:
          "Why do interface libraries rely on reference equality instead of comparing values deeply?",
        options: [
          "Deep comparison is impossible for nested objects",
          "Reference comparison is constant time, while deep comparison costs time proportional to the data",
          "Reference comparison detects more kinds of change",
          "Deep comparison would trigger getters",
        ],
        answer: 1,
        explanation:
          "Identity comparison is a single check regardless of size, which is what makes change detection affordable on every update. Thinking reference comparison detects more change is backwards: it detects less, and the discipline of always producing a new object is what makes the cheaper test sound.",
        difficulty: "Medium",
        skill: "Referential equality",
      },
      {
        n: 5,
        question:
          "An update changes state.user.address.city. Which objects must be newly created?",
        options: [
          "Only the address object",
          "Every object in the entire state tree",
          "state, state.user and state.user.address",
          "Only the top level state object",
        ],
        answer: 2,
        explanation:
          "Every container on the path from the root to the change must be copied so that comparing the root detects it, while everything off that path is reused by reference. Copying only the address is the tempting minimal answer, but then the root is unchanged and no consumer comparing at the top will ever notice.",
        difficulty: "Medium",
        skill: "Structural sharing",
      },
      {
        n: 6,
        question:
          "A selector returns items.filter(isActive) on every call and a memoised child rerenders every time. Why?",
        options: [
          "filter mutates the source array",
          "A new array is allocated on each call, so the reference differs even when the contents are identical",
          "Memoisation compares arrays deeply and finds a difference",
          "The child is not actually memoised",
        ],
        answer: 1,
        explanation:
          "filter produces a fresh array each call, and a shallow comparison sees a different reference, so the memo boundary never holds. Suspecting deep comparison is the tempting explanation, but the default comparison is exactly what makes this fail: it is shallow, and a new reference is a change.",
        difficulty: "Hard",
        skill: "Referential equality",
      },
      {
        n: 7,
        question:
          "What does Object.freeze actually guarantee?",
        options: [
          "The object and everything reachable from it become immutable",
          "Only the object's own direct properties cannot be added, removed or changed",
          "Attempts to mutate always throw an error",
          "The object can no longer be copied",
        ],
        answer: 1,
        explanation:
          "Freezing is shallow, so a nested array held by a frozen object can still be mutated freely, and outside strict mode the failed writes are silent rather than throwing. Assuming deep immutability is exactly the misconception that makes freeze feel like a guarantee when it is only a local assertion.",
        difficulty: "Hard",
        skill: "Defensive copying",
      },
      {
        n: 8,
        question:
          "Why does keeping fifty previous states for undo cost far less than fifty full copies?",
        options: [
          "Old states are compressed automatically by the engine",
          "Each version shares every untouched subtree, so only the path to each change is duplicated",
          "Only the differences are stored as text patches",
          "The engine deduplicates identical objects on garbage collection",
        ],
        answer: 1,
        explanation:
          "Structural sharing means an update copies the containers on the path to the change and reuses everything else by reference, so the memory cost is proportional to depth rather than to the size of the state. Text patches describe a different technique entirely, and nothing in the runtime deduplicates objects for you.",
        difficulty: "Hard",
        skill: "Structural sharing",
      },
    ],
  },

  5008: {
    topicId: 5008,
    title: "The rendering model and reconciliation",
    summary:
      "Learn what a component actually is, what happens between a state update and a changed pixel, and why keys, identity and render purity decide whether your interface behaves.",
    concepts: [
      "Declarative rendering",
      "Reconciliation",
      "Element identity and keys",
      "Render purity",
      "Commit phase",
      "Batching",
    ],
    glossary: {
      Element:
        "A plain description of what should appear, produced by calling a component, as opposed to the DOM node eventually created from it.",
      Reconciliation:
        "The comparison of the new element tree against the previous one to decide the smallest set of changes to apply.",
      Key: "A stable identifier that tells the reconciler which item in a list is which across renders.",
      "Render phase":
        "The pure computation of the next element tree, which may be discarded or repeated and must therefore have no side effects.",
      "Commit phase":
        "The short synchronous step that applies the computed changes to the DOM and runs layout effects.",
      Batching:
        "Grouping several state updates so that one render and one commit serve all of them.",
      "Reset by identity":
        "Deliberately changing a component's key so it unmounts and remounts with fresh state.",
    },
    body: {
      Beginner: `<p>The old way to build an interface was to give instructions: find this element, change its text, hide that other one. The declarative way is to write a function that says what the screen should look like for the current data, and let the library work out what to change.</p>
<pre>function Greeting(props) {
  return &lt;p&gt;Hello, {props.name}&lt;/p&gt;;
}</pre>
<p>Nothing there touches the page. The function returns a description, and the library compares that description with the previous one and edits only what differs. If only the name changed, only that text node is touched.</p>
<h2>Two steps every update takes</h2>
<ul>
<li><strong>Work out what changed.</strong> Your components run and return descriptions. This part can happen more than once and is thrown away if it turns out to be unnecessary.</li>
<li><strong>Apply it.</strong> The real page is updated in one short burst, and only then do you see anything.</li>
</ul>
<p>Because the first step may run more than once, your component must not do anything with lasting consequences while it runs. No writing to a variable outside itself, no sending a request, no changing the page directly. Describe, do not act.</p>
<h2>Lists need names</h2>
<p>When you render a list, the library needs to know which item is which after the data changes. That is what the <code>key</code> is for, and it must come from the data.</p>
<pre>{todos.map(function (todo) {
  return &lt;Todo key={todo.id} todo={todo} /&gt;;
})}</pre>
<aside class="tip">Using the array position as a key is the classic mistake. Delete the first item and every remaining item shifts up one position, so the library thinks every item changed its content rather than that one was removed. Anything typed into an input in that list ends up attached to the wrong row.</aside>
<h2>Updates are grouped</h2>
<p>Setting three pieces of state in the same handler does not redraw three times. The updates are collected and one redraw serves all of them, which is why reading a state variable immediately after setting it still shows the old value: the new one belongs to the next render.</p>`,
      Intermediate: `<p>A component is a function from props and state to a tree of elements. It is not an object that owns DOM nodes, and this distinction explains most of the model's behaviour.</p>
<h2>Elements are descriptions</h2>
<p>Calling a component produces plain objects describing type, props and children. Nothing is created or mutated at that point. The library then performs <strong>reconciliation</strong>: it walks the new tree alongside the previous one and decides, position by position, whether to update the existing instance, or to discard it and build a new one.</p>
<p>The rule at each position is deliberately simple. If the element type is the same, the existing instance is kept and its props are updated, preserving its state and its DOM node. If the type differs, the whole subtree is torn down and rebuilt, and any state inside it is lost. Two consequences follow directly: conditionally rendering different element types at the same position resets state, and rendering the same type with different props never does.</p>
<h2>Keys are identity within a list</h2>
<p>Within a set of siblings, position is not identity, so a <strong>key</strong> supplies it. A stable key from the data lets the reconciler match items across renders, so reordering moves nodes instead of rewriting their contents, and removal deletes exactly one item. An index key breaks this precisely when the list changes shape, which is the only time it matters, and the symptoms appear in whatever state lives inside the row: focus, input values, animation state, scroll position.</p>
<p>The same mechanism can be used deliberately. Changing the key on a component is the supported way to <strong>reset by identity</strong>, for example remounting a form when the record being edited changes, which is far more reliable than an effect that clears each field.</p>
<h2>The two phases</h2>
<ul>
<li>The <strong>render phase</strong> is pure and interruptible. It may run twice in development to surface impurity, may be abandoned if a higher priority update arrives, and must therefore contain no side effects at all.</li>
<li>The <strong>commit phase</strong> is synchronous and short. The DOM is mutated, refs are attached, layout effects run before the browser paints, and passive effects run shortly after.</li>
</ul>
<h2>Batching and the value of state</h2>
<p><strong>Batching</strong> means all updates queued in the same handler produce one render. State variables are constants for the duration of a render, so reading one after setting it yields the old value by design. When the next value depends on the current one, use the functional form, which is applied against the latest queued value rather than the one captured when the handler was created.</p>
<aside class="tip">If a component renders differently on a second identical render, it is impure, and the framework is entitled to run it twice. Random values, current time and reads of mutable module state all belong outside the render, computed once and stored, or derived from something stable.</aside>`,
      Advanced: `<p>Assume the phases and keys. What matters at this level is scheduling, the boundaries where purity is enforced, and how the model behaves when work is interrupted or replayed.</p>
<h2>Interruptible rendering changes the contract</h2>
<p>Once rendering is concurrent, a render may begin, be abandoned, and begin again with newer state before anything is committed. That is why the <strong>render phase</strong> must be a pure function of its inputs: partial work is discarded, and any effect performed during it would happen a number of times nobody can predict. It is also why reading mutable external state during render is unsafe without a subscription primitive, since the value can differ between the start of the render and the commit, producing an interface that shows data that never existed as a consistent snapshot.</p>
<h2>Priority and transitions</h2>
<p>Not every update deserves the same urgency. A keystroke that updates an input must be applied immediately; the filtered list it drives can lag by a frame without anyone noticing. Marking the second kind as a transition lets the scheduler interrupt it when a more urgent update arrives, and lets it show the previous content while the new content is prepared, rather than an empty state. The pattern only works if the expensive work is genuinely in the render, since a transition cannot make a slow network call finish sooner.</p>
<h2>Where reconciliation costs more than expected</h2>
<ul>
<li>Defining a component inside another component creates a new type on every render, so the reconciler destroys and rebuilds the entire subtree, including its state, every time.</li>
<li>An inline object or arrow passed as a prop is a new reference each render and defeats any memo boundary below it, which is the usual reason a memoised subtree still renders.</li>
<li>Context propagates to every consumer regardless of memoisation between them, so a frequently changing value in a widely consumed context is effectively a global rerender.</li>
<li>Very large lists are not a reconciliation problem to be optimised but a rendering problem to be avoided, by rendering only the visible window.</li>
</ul>
<aside class="tip">Layout effects run after mutation and before paint, so measuring a node there and setting state produces a corrected frame the user never sees. Doing the same measurement in a passive effect produces one visible frame of wrong layout, which is the flicker people try to fix with timers.</aside>`,
      Expert: `<p>The model is best described as a persistent tree of work units with a scheduler on top. Each update produces an alternate tree that shares unchanged nodes with the current one, and only when the alternate is complete is it swapped in atomically. Reading it as double buffering with structural sharing explains the guarantees precisely: partial work is invisible, and consistency is a property of the commit rather than of any moment during the render.</p>
<h2>Consequences of the atomic commit</h2>
<p>Because the tree is swapped as a unit, no consumer can observe a mixture of old and new data, which is what makes concurrent rendering safe to expose to application code. It also means the cost of an update is bounded by the changed path plus whatever the reconciler cannot prove is unchanged, and that proof is exactly reference equality on props. This is why the memoisation story and the immutability story are the same story: a new reference is the only signal available, so allocating a fresh object for unchanged data is not a style question but a direct instruction to redo work.</p>
<h2>What the common explanations get wrong</h2>
<ul>
<li><strong>The virtual DOM is not a performance feature.</strong> A hand written imperative update is faster than any diff. The tree exists to make a declarative description cheap enough to be practical, and the correct comparison is with the alternative programming model, not with hand tuned mutations.</li>
<li><strong>Reconciliation does not compute a minimal edit script.</strong> It is a heuristic single pass over siblings with keys as the matching hint, chosen because the general tree diff problem is cubic. Assuming minimality is what leads people to expect a moved subtree to preserve state without a key.</li>
<li><strong>Batching is not limited to event handlers.</strong> Modern versions batch across timers, promises and native handlers, so code that depended on an unbatched update after an await changed behaviour without any change to itself.</li>
<li><strong>Double invocation in development is a diagnostic, not a bug.</strong> It exists because a scheduler that may discard work requires purity, and impurity that only manifests under interruption is otherwise found in production.</li>
</ul>
<h2>Designing with identity in mind</h2>
<p>Since state is attached to a position and a type, the architectural questions are where state should live and what should reset it. Deliberate use of <strong>reset by identity</strong> is the cleanest available answer for editing a different record, and it composes better than clearing fields, because it also resets anything a child holds that the parent does not know about. Conversely, an accidental type change at a position, most often from a component defined inline or a conditional wrapper, is the same mechanism firing when nobody asked for it. Both come down to one question that is worth asking of every subtree: what makes this the same component as the one that was here before.</p>
<aside class="tip">Before optimising a render, establish whether the cost is the number of components rendered or the work inside one of them. The first is solved by identity and boundaries, the second by moving work out of the <strong>render phase</strong> entirely. Applying the remedy for one to the other is how a codebase acquires a memo on every component and no measurable improvement.</aside>`,
    },
  },

  5009: {
    topicId: 5009,
    title: "State ownership: lifting, colocating, deriving",
    summary:
      "Decide where each piece of state belongs, which values should not be state at all, and how to keep a component tree from turning into a pile of synchronised copies.",
    concepts: [
      "Colocation",
      "Lifting state up",
      "Derived state",
      "Single source of truth",
      "Controlled and uncontrolled",
      "Prop drilling and context",
    ],
    glossary: {
      Colocation:
        "Keeping state in the lowest component that needs it, so nothing above has to know it exists.",
      "Lifting state up":
        "Moving state to the closest common ancestor of every component that reads or writes it.",
      "Derived value":
        "Something computed from existing state during render, which must never be stored as state of its own.",
      "Single source of truth":
        "The rule that each fact is stored in exactly one place, with everything else computed from it.",
      "Controlled component":
        "An input whose displayed value comes from state, making the state authoritative on every keystroke.",
      "Uncontrolled component":
        "An input that keeps its own value in the DOM, read only when needed, usually on submit.",
      "Prop drilling":
        "Passing a value through components that do not use it, purely to reach one that does.",
    },
    body: {
      Beginner: `<p>Every piece of information in an interface lives somewhere. Choosing that place well is most of what makes a component tree pleasant or painful to work in, and there are only three questions to ask.</p>
<h2>Question one: does anyone else need it?</h2>
<p>If only one component uses a value, keep it inside that component. A dropdown that knows whether it is open does not need anyone above it to know. Pushing that upward gives the parent something to care about and gains you nothing.</p>
<h2>Question two: who else needs it?</h2>
<p>If two components need the same value, it cannot live in either of them, because siblings cannot see each other's insides. It moves up to the nearest component that contains both of them, and it comes back down as props. That move is called lifting state up.</p>
<pre>function Filters() {
  const [query, setQuery] = useState("");
  return (
    &lt;&gt;
      &lt;SearchBox value={query} onChange={setQuery} /&gt;
      &lt;ResultCount query={query} /&gt;
    &lt;/&gt;
  );
}</pre>
<h2>Question three: can it be worked out instead?</h2>
<p>If a value can be calculated from something you already have, calculate it. Do not store it.</p>
<pre>const total = items.reduce(function (sum, i) { return sum + i.price; }, 0);</pre>
<p>Storing the total as well as the items means two things must be kept in step forever, and eventually they will not be.</p>
<aside class="tip">A useful smell test: if you ever find yourself writing code whose job is to copy one piece of state into another so they match, you have stored the same fact twice. Delete one of them and compute it instead.</aside>`,
      Intermediate: `<p>State placement is a design decision with real consequences for rerenders, testability and how often two parts of the screen disagree. Three principles handle almost every case.</p>
<h2>Colocate by default</h2>
<p><strong>Colocation</strong> means state starts in the component that uses it and moves only when forced. The benefit is not tidiness but blast radius: state held in a leaf rerenders that leaf, while the same state held at the root rerenders everything under it. Codebases that put all state in one store from the beginning generally end up with a render cost proportional to the whole application on every keystroke.</p>
<h2>Lift only to the meeting point</h2>
<p><strong>Lifting state up</strong> is the answer when two components must agree, and the destination is the closest common ancestor, not the top. Lifting further than necessary widens the rerender scope and adds props to components that do not care. When the meeting point really is far away and the chain between is long, that is the signal to reach for context rather than to keep threading props, because <strong>prop drilling</strong> through six layers makes every one of them depend on a value they never read.</p>
<h2>Derive relentlessly</h2>
<p>A <strong>derived value</strong> is anything computable from state and props during render: totals, filtered lists, whether the form is valid, whether the button should be disabled. Storing it creates a second copy of a fact and an obligation to synchronise, and the synchronisation is where the bugs are. The test is simple: if you can write an expression that produces it from state you already hold, it is not state.</p>
<pre>const visible = items.filter(function (i) { return i.name.includes(query); });
const canSubmit = query.trim().length > 0 &amp;&amp; !saving;</pre>
<h2>Controlled or uncontrolled</h2>
<p>A <strong>controlled component</strong> takes its displayed value from state, so every keystroke is an update and the state is authoritative at all times. That is what you want when something else on screen depends on the value as you type. An <strong>uncontrolled component</strong> keeps the value in the DOM and is read on submit, which is cheaper and perfectly appropriate for a long form where nothing reacts until the end. Choosing controlled everywhere by reflex is a common and expensive habit.</p>
<aside class="tip">Props that initialise state are a trap. A value read once with useState is a snapshot, so a later change to the prop is ignored and the component silently shows stale data. Either make the value fully controlled from above, or reset the component deliberately by changing its key.</aside>`,
      Advanced: `<p>Assume the three principles. The harder question is what to do when state is genuinely shared, when it must survive navigation, and when the naive placement makes performance unacceptable.</p>
<h2>Categories of state, which want different homes</h2>
<ul>
<li><strong>Interface state</strong>, such as whether a panel is open, belongs colocated and rarely needs a store.</li>
<li><strong>Form state</strong> is local until submitted, at which point only the result is shared.</li>
<li><strong>Server state</strong> is a cache of something you do not own, and it wants its own layer with keys, staleness and invalidation rather than a place in a component.</li>
<li><strong>URL state</strong>, such as the current filter or page, belongs in the address bar so it survives a refresh and can be shared as a link.</li>
</ul>
<p>Treating server data as ordinary state is the most consequential mistake in this list, because it obliges you to reimplement caching, deduplication and refetching by hand in every component that needs it.</p>
<h2>Context is not a store</h2>
<p>Context solves distribution, not change management: every consumer rerenders when the value changes, regardless of which part of it they read. Two techniques keep it usable. Split a context that mixes rarely changing data with frequently changing data into two, so the stable half does not drag consumers along. And keep the provided value referentially stable, since a fresh object literal in the provider rerenders every consumer on every parent render even when nothing in it changed.</p>
<h2>When derivation is expensive</h2>
<p>Deriving is right by default, and the exception is a computation heavy enough to be noticeable on every render, which is memoised rather than stored. The distinction matters: a memoised value is still derived, so it cannot go stale, whereas a stored copy can. Reach for storage only where the value is genuinely an independent fact, for example the last search the user actually submitted as opposed to what is currently in the box.</p>
<aside class="tip">Reducers earn their place when several fields change together under rules. A single dispatch of a described action moves the whole object to a legal state atomically, whereas three separate setters give the render in between a chance to observe a combination that should be impossible.</aside>`,
      Expert: `<p>State ownership is the same normalisation problem you meet in a database, applied to a component tree. Each fact should be stored once, at the smallest scope that spans all of its readers, with everything else a view over it. Every classic symptom in this area, screens disagreeing, values resetting unexpectedly, effects that copy one state into another, is a duplication or a scope error.</p>
<h2>Scope as the primary variable</h2>
<p>Placing state at scope S means every reader below S can see it and every update rerenders S downward, minus whatever boundaries prove they are unaffected. That gives a clean formulation: the correct home is the lowest node that dominates the set of readers, and any placement above it trades render cost for nothing. This is precisely a lowest common ancestor computation over the tree, which is why the mechanical rule of <strong>lifting state up</strong> to the meeting point is not a heuristic but the exact answer.</p>
<h2>Where the received wisdom needs qualification</h2>
<ul>
<li><strong>Single source of truth does not mean a single store.</strong> It means each fact has one home. A global store containing a copy of data the server owns has two homes for the same fact and no protocol for reconciling them.</li>
<li><strong>Derived state is forbidden, cached derivation is not.</strong> The difference is whether the value can be observed disagreeing with its inputs. A memo cannot; a state variable written by an effect can, for at least one frame and sometimes permanently.</li>
<li><strong>Context has no selector semantics.</strong> Consumers cannot subscribe to part of a value, so the granularity of your contexts is the granularity of your rerenders. External stores with a subscription and a selector exist for exactly this gap.</li>
<li><strong>Uncontrolled is not a lesser choice.</strong> The DOM is a perfectly good owner for a value nothing else reads until submission, and treating it as one removes a render per keystroke across an entire form.</li>
</ul>
<h2>Designing the boundary between layers</h2>
<p>A durable structure separates three layers explicitly: the server cache, keyed and invalidated by its own rules; the shared application state that is genuinely client owned, such as a draft or a selection; and colocated component state for everything else. Interactions cross these layers in one direction, with components reading from the cache and dispatching intent rather than writing into it. The payoff is that the hardest questions in the system, staleness and consistency, are confined to one layer instead of being distributed across every component that happens to fetch something.</p>
<aside class="tip">When two components must agree and neither contains the other, three answers exist: lift to the common ancestor, move the fact into the URL, or move it into a store outside the tree. Choosing by how far apart they are, and how long the value must live, gets it right nearly every time. An effect that copies state between them is not on the list.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Find where a piece of state must live",
        difficulty: "Medium",
        statement: `<p>The rule for placing shared state is exact: it belongs in the lowest component that contains every component reading or writing it. That is a lowest common ancestor query over the component tree.</p>
<p>You are given a tree of nodes shaped <code>{ id, children }</code>, where <code>children</code> may be missing, and an array of component ids that use the state.</p>
<p>Return the id of the lowest node that has every listed component in its subtree, counting a node as being in its own subtree. That last part is what makes a single reader own its own state, and what makes a parent that also reads the value the owner rather than pushing it higher.</p>
<ul>
<li>Ids are unique within the tree.</li>
<li>Return <code>null</code> if the list is empty, or if any listed id does not appear in the tree.</li>
</ul>`,
        fn: "lowestOwner",
        params: "tree, users",
        tests: [
          {
            args: [
              {
                id: "App",
                children: [
                  { id: "Header", children: [{ id: "CartBadge" }] },
                  { id: "Catalogue", children: [{ id: "ProductCard", children: [{ id: "AddToCart" }] }] },
                  { id: "CartPanel" },
                ],
              },
              ["CartBadge"],
            ],
            expected: "CartBadge",
            label: "a single reader colocates",
          },
          {
            args: [
              {
                id: "App",
                children: [
                  { id: "Header", children: [{ id: "CartBadge" }] },
                  { id: "Catalogue", children: [{ id: "ProductCard", children: [{ id: "AddToCart" }] }] },
                  { id: "CartPanel" },
                ],
              },
              ["CartBadge", "AddToCart"],
            ],
            expected: "App",
            label: "distant readers lift to the root",
          },
          {
            args: [
              {
                id: "App",
                children: [
                  { id: "Catalogue", children: [{ id: "ProductCard", children: [{ id: "AddToCart" }, { id: "Price" }] }] },
                ],
              },
              ["Price", "AddToCart"],
            ],
            expected: "ProductCard",
            label: "siblings lift to their parent",
          },
          {
            args: [
              {
                id: "App",
                children: [{ id: "Catalogue", children: [{ id: "ProductCard", children: [{ id: "AddToCart" }] }] }],
              },
              ["ProductCard", "AddToCart"],
            ],
            expected: "ProductCard",
            label: "an ancestor that also reads owns it",
          },
          {
            args: [{ id: "App", children: [{ id: "Header" }] }, ["Header", "Footer"]],
            expected: null,
            label: "unknown component",
          },
          {
            args: [{ id: "App", children: [{ id: "Header" }] }, []],
            expected: null,
            label: "no readers",
            hidden: true,
          },
        ],
        hints: [
          "The path from the root to a component is exactly the list of components that could own state on its behalf.",
          "Collect one path per reader, then walk the paths together from the root and stop at the first position where they disagree.",
          "Because a node counts as being inside its own subtree, the answer is the last id shared by every path, which handles the ancestor case with no extra branch.",
        ],
        solution: `function lowestOwner(tree, users) {
  if (!users || users.length === 0) return null;

  function pathTo(node, id, prefix) {
    var here = prefix.concat([node.id]);
    if (node.id === id) return here;
    var kids = node.children || [];
    for (var i = 0; i < kids.length; i++) {
      var found = pathTo(kids[i], id, here);
      if (found) return found;
    }
    return null;
  }

  var paths = [];
  for (var u = 0; u < users.length; u++) {
    var path = pathTo(tree, users[u], []);
    if (!path) return null;
    paths.push(path);
  }

  var owner = null;
  for (var depth = 0; depth < paths[0].length; depth++) {
    var candidate = paths[0][depth];
    var shared = true;
    for (var p = 1; p < paths.length; p++) {
      if (paths[p][depth] !== candidate) { shared = false; break; }
    }
    if (!shared) break;
    owner = candidate;
  }
  return owner;
}`,
        skills: ["Lifting state up", "Colocation", "Single source of truth"],
      },
    ],
  },

  5010: {
    topicId: 5010,
    title: "Effects, and the four times you actually need one",
    summary:
      "Stop reaching for an effect as the default tool. Learn the small set of jobs that genuinely require synchronising with something outside your component, and what to write for everything else.",
    concepts: [
      "External synchronisation",
      "Cleanup functions",
      "Dependency arrays",
      "Event handlers versus effects",
      "Subscriptions",
      "Effect ordering",
    ],
    glossary: {
      Effect:
        "Code that synchronises a component with a system outside it, run after the commit rather than during render.",
      Cleanup:
        "The function an effect returns, run before the next execution of that effect and once more on unmount.",
      "Dependency array":
        "The list of reactive values an effect reads, which decides when it runs again.",
      "Stale closure":
        "An effect or callback still holding bindings from an earlier render, so it reads values that are no longer current.",
      Subscription:
        "A registration with an external source that must be undone on cleanup to avoid leaks and duplicate handling.",
      "Layout effect":
        "An effect that runs after mutation but before paint, used to measure and correct layout without a visible flicker.",
      "Effect ordering":
        "The rule that children's effects run before their parents' on mount, and that cleanups run in the reverse order.",
    },
    body: {
      Beginner: `<p>An effect is a way to say: after the screen has been updated, go and do something outside my component. Beginners reach for it constantly, and most of the time it is the wrong tool. Here is the whole rule.</p>
<h2>If it happens because someone did something, it is not an effect</h2>
<p>Clicking Save should send the request from the click handler. Submitting a form should do its work in the submit handler. The event already tells you what happened and when, so putting the work in an effect adds a layer of guessing about which state change caused it.</p>
<h2>If it can be worked out from what you already have, it is not an effect</h2>
<pre>// no
const [total, setTotal] = useState(0);
useEffect(function () { setTotal(items.length); }, [items]);

// yes
const total = items.length;</pre>
<p>The first version renders once with the wrong number, then again with the right one, and can get out of step. The second cannot be wrong.</p>
<h2>What is left</h2>
<p>Effects are for talking to things that are not part of your component: the browser itself, a timer, a socket, a chart library that draws into a node you gave it. In each case there is something to start and, crucially, something to stop.</p>
<pre>useEffect(function () {
  const id = setInterval(tick, 1000);
  return function () { clearInterval(id); };
}, []);</pre>
<aside class="tip">The returned function is the cleanup, and forgetting it is the most common bug in this area. Without it you get two timers, then four, then a page that gets slower the longer it is open.</aside>
<h2>The dependency list</h2>
<p>The array at the end lists the values the effect uses. Leave a value out and the effect keeps using an old copy of it. The linter will tell you what belongs there, and the right response is almost never to silence it.</p>`,
      Intermediate: `<p>An effect is a synchronisation primitive. It exists to keep something outside the component in step with something inside it, and it is not a lifecycle hook, despite being widely used as one.</p>
<h2>The four legitimate jobs</h2>
<ul>
<li><strong>Subscribing to an external source.</strong> A socket, a media query, a store outside the tree, the browser's online status. Subscribe on run, unsubscribe on <strong>cleanup</strong>.</li>
<li><strong>Driving an imperative library.</strong> A map, a chart, a video player. Create on mount, update when inputs change, destroy on cleanup.</li>
<li><strong>Synchronising with browser state you do not own.</strong> Document title, focus, scroll position, a global event listener.</li>
<li><strong>Fetching data</strong>, in the absence of a framework that does it for you, with the caveats around races that make a dedicated library the better answer.</li>
</ul>
<p>Everything else has a better home. Work caused by an interaction belongs in the handler. Values computable from state belong in the render body. Resetting a component when a prop changes belongs in a key, not in an effect that clears fields one by one.</p>
<h2>Dependencies are not a tuning knob</h2>
<p>The <strong>dependency array</strong> declares every reactive value the effect reads. Omitting one produces a <strong>stale closure</strong>: the effect keeps the binding from the render in which it was created and quietly works with old data. Adding one that changes every render produces an effect that runs constantly. The correct fixes are structural rather than editorial: move a function inside the effect so it is not a dependency, memoise it if it must stay outside, or use the functional form of a state update so the current value is not needed at all.</p>
<h2>Cleanup runs more often than people expect</h2>
<p>Cleanup runs before every re execution of the effect, not only on unmount, which is what makes an effect a synchronisation rather than a setup. In development the mount sequence is deliberately run twice to expose effects that are not symmetrical, and an effect that fails that test has a real bug: it is one that would also break under a fast remount or a restored back and forward navigation.</p>
<aside class="tip">A useful phrasing: an effect answers what should be true of the outside world while this component is on screen with these props. If your code answers what should happen when the user clicks, or what should happen once at the beginning, it is not an effect and putting it in one will eventually run it twice.</aside>`,
      Advanced: `<p>Assume the four jobs. The remaining difficulty is ordering, race conditions and the boundary between values that should be reactive and values that should merely be current.</p>
<h2>Ordering guarantees</h2>
<p><strong>Effect ordering</strong> is defined and occasionally load bearing. On mount, effects run depth first, so a child's effect runs before its parent's, which is why a parent cannot rely on measuring something a child sets up in its own effect without an extra pass. Cleanups run in the reverse order, and when several effects in one component are re run, their cleanups all run before any of the new bodies. Layout effects run in the same relative order but earlier in the frame, after mutation and before paint, which is what makes them the right tool for measuring and correcting geometry, and the wrong tool for anything slow.</p>
<h2>Races and the two remedies</h2>
<p>An effect that fetches must assume its result can arrive after a newer one. The two mechanisms are a cancellation flag captured by the cleanup, which prevents the stale result from being applied, and an <strong>AbortController</strong>, which additionally stops the work. They compose: abort the request and ignore the outcome. Neither removes the deeper problem, which is that request state now lives in a component, which is the argument for a fetching layer with keys and deduplication.</p>
<h2>Reactive versus current</h2>
<ul>
<li>A value the effect should react to belongs in the dependency array, and its change should genuinely mean the synchronisation must be redone.</li>
<li>A value the effect merely needs the latest version of, such as a callback prop that should not restart a socket, belongs in a ref updated on each render, or in an effect event where that primitive is available.</li>
<li>Objects and arrays as dependencies compare by identity, so an inline literal restarts the effect every render. Depend on primitive fields, or memoise the object at its source.</li>
<li>Storing a function in state, or creating one inside a dependency, produces the same identity churn with a less obvious cause.</li>
</ul>
<aside class="tip">Chained effects, where one effect sets state that triggers another, produce a cascade of renders and an order that is difficult to reason about. If two things must both be true, compute both in one place. If one genuinely follows the other, it is usually an event, not a chain.</aside>`,
      Expert: `<p>The model is that an effect describes a relationship to be maintained between component state and an external system, not a sequence of steps to be performed at moments in a lifecycle. Once rendering is interruptible and components may be mounted, unmounted and restored, the lifecycle framing stops being merely inelegant and becomes incorrect: there is no single moment called mount that can be relied upon.</p>
<h2>Why the double invocation exists</h2>
<p>Running mount, cleanup and mount again in development is a test of a property the runtime intends to depend on: that an effect plus its cleanup is idempotent with respect to the outside world. Any effect that fails this would also fail under state restoration on back navigation, under a remount caused by an identity change, and under any future scheduling that discards and reruns work. Treating the double invocation as noise to be suppressed means keeping a defect that will present later as duplicated <strong>subscriptions</strong>, doubled analytics events or two live sockets.</p>
<h2>Where the standard advice is incomplete</h2>
<ul>
<li><strong>Dependency lint is necessary and not sufficient.</strong> It verifies that everything read is declared; it cannot tell you that a declared dependency changes identity every render, which is the more common cause of an effect that runs too often.</li>
<li><strong>Refs escape reactivity by design.</strong> Reading a ref inside an effect deliberately opts out of the dependency system, which is correct for latest value semantics and silently wrong for anything the effect should react to.</li>
<li><strong>Layout effects block the frame.</strong> They run before paint, so expensive work there is directly visible as jank, and a chain of them across a large tree can cost more than the render that produced it.</li>
<li><strong>Subscribing to an external store inside an effect can tear.</strong> Between render and effect the store may change, so the first painted frame can show a value that is already stale. The dedicated store subscription primitive exists to close exactly that window.</li>
</ul>
<h2>An architecture that needs fewer effects</h2>
<p>Most codebases can remove the majority of their effects by relocating three categories: derived values into the render body, interaction consequences into handlers, and server data into a caching layer. What remains is a small, honest set of adapters between the component tree and the world outside it, each with a symmetric cleanup and a dependency list that reads as a specification of when the relationship changes. That set is small enough to review, which is the practical measure of whether the architecture is right.</p>
<aside class="tip">Before writing an effect, answer two questions in writing. What external system is being kept in step, and what exactly undoes it. If the first has no answer, the code belongs elsewhere. If the second has no answer, you have written a leak.</aside>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Which of these genuinely requires an effect?",
        options: [
          "Computing an order total from the items already in state",
          "Sending an analytics event when a button is clicked",
          "Subscribing to a browser media query while the component is on screen",
          "Clearing a form when the selected record changes",
        ],
        answer: 2,
        explanation:
          "A media query listener is an external system that must be registered while the component is mounted and unregistered afterwards, which is exactly what an effect plus cleanup expresses. Clearing a form on a prop change is the tempting distractor, but changing the component key resets it wholesale and cannot fall out of step.",
        difficulty: "Easy",
        skill: "External synchronisation",
      },
      {
        n: 2,
        question:
          "An effect starts an interval and returns nothing. What is the consequence?",
        options: [
          "The interval stops automatically when the component unmounts",
          "Each run of the effect adds another live interval, and none are ever cleared",
          "The effect only runs once, so there is no problem",
          "The interval is garbage collected once the component is removed",
        ],
        answer: 1,
        explanation:
          "Without a cleanup nothing cancels the timer, so every re execution stacks another one and unmounting leaves the last still firing against a component that no longer exists. Assuming garbage collection handles it is the natural but wrong instinct, because the timer registry holds a live reference to the callback.",
        difficulty: "Easy",
        skill: "Cleanup functions",
      },
      {
        n: 3,
        question:
          "An effect reads a prop but the dependency array is left empty. What happens?",
        options: [
          "The effect re runs on every render to stay current",
          "The effect keeps the binding from the first render and works with stale data",
          "The framework throws an error at runtime",
          "The prop is read fresh each time because props are not captured",
        ],
        answer: 1,
        explanation:
          "The effect body is a closure over the render that created it, so an empty dependency list means it keeps that render's bindings indefinitely and silently uses old values. Expecting props to be read fresh misunderstands the capture: nothing rereads them, because the function itself is never recreated.",
        difficulty: "Medium",
        skill: "Dependency arrays",
      },
      {
        n: 4,
        question:
          "Why does an object literal passed as a dependency cause the effect to run on every render?",
        options: [
          "Objects are compared deeply and always differ",
          "Dependencies are compared by identity, and a literal creates a new object each render",
          "Objects are not permitted as dependencies",
          "The effect re runs whenever any dependency is not a primitive",
        ],
        answer: 1,
        explanation:
          "Comparison is by reference, so a freshly allocated object is never equal to the previous one even when every field matches. Believing the comparison is deep is the tempting error, and it would in fact solve this case, which is precisely why the actual shallow behaviour surprises people.",
        difficulty: "Medium",
        skill: "Dependency arrays",
      },
      {
        n: 5,
        question:
          "In development, mount runs, then cleanup, then mount again. What is this checking?",
        options: [
          "That rendering is fast enough to run twice",
          "That the effect and its cleanup are symmetrical, so setup can be safely repeated",
          "That the dependency array is complete",
          "That the component has no state",
        ],
        answer: 1,
        explanation:
          "The double invocation exercises the property the runtime relies on, that running an effect and its cleanup leaves the outside world as it was, so the effect can be repeated safely. Reading it as a performance check misses the point: an effect that fails this test also breaks on remount and on restored navigation in production.",
        difficulty: "Medium",
        skill: "Cleanup functions",
      },
      {
        n: 6,
        question:
          "A component fetches in an effect and applies whatever arrives. The user types quickly and an older response lands last. What is the standard fix?",
        options: [
          "Increase the debounce until responses cannot overlap",
          "Capture a cancellation flag in the effect and have the cleanup mark it, ignoring superseded results",
          "Store all responses and pick the largest",
          "Move the fetch into the render body so it runs earlier",
        ],
        answer: 1,
        explanation:
          "The cleanup runs before the next effect execution, so flipping a captured flag lets the stale continuation see that it has been superseded and skip applying its result. Longer debouncing only reduces the probability, which means the bug survives in exactly the conditions that produced the report, a slow network.",
        difficulty: "Hard",
        skill: "Event handlers versus effects",
      },
      {
        n: 7,
        question:
          "Which statement about effect ordering on mount is correct?",
        options: [
          "A parent's effect runs before its children's effects",
          "A child's effect runs before its parent's effect",
          "Effects run in the order the components were defined in the file",
          "Ordering is unspecified and must never be relied on",
        ],
        answer: 1,
        explanation:
          "Effects run depth first after the commit, so children complete before their parents, which is why a parent cannot assume a child's effect has not yet run. The intuition that parents go first comes from thinking of effects as constructors, but they are attached after the whole tree has been committed.",
        difficulty: "Hard",
        skill: "Effect ordering",
      },
      {
        n: 8,
        question:
          "A socket effect must call the latest onMessage prop without reconnecting every time that prop changes. What is the appropriate technique?",
        options: [
          "Leave onMessage out of the dependency array and read it directly",
          "Keep the latest onMessage in a ref updated each render, and read the ref inside the effect",
          "Memoise onMessage in the parent with an empty dependency list",
          "Store onMessage in component state",
        ],
        answer: 1,
        explanation:
          "A ref gives latest value semantics without participating in reactivity, so the socket stays open while the callback stays current. Simply omitting it from the array looks equivalent and is not, since the effect would then hold the first render's callback forever, which is the stale closure this technique exists to avoid.",
        difficulty: "Hard",
        skill: "Subscriptions",
      },
    ],
  },

  5011: {
    topicId: 5011,
    title: "Data fetching, caching and race conditions",
    summary:
      "Treat server data as a cache rather than as state, and build fetching that survives fast typing, slow networks and two components asking for the same thing at once.",
    concepts: [
      "Server state as cache",
      "Query keys",
      "Staleness and revalidation",
      "Request deduplication",
      "Race conditions",
      "Optimistic updates",
    ],
    glossary: {
      "Query key":
        "The identifier for a cached request, usually the endpoint plus its parameters, which decides what is shared and what is invalidated.",
      Stale:
        "Cached data still shown to the user but considered old enough to be refreshed in the background.",
      Revalidation:
        "Refetching in the background while the previous data stays on screen, so nothing flashes empty.",
      Deduplication:
        "Serving several simultaneous requests for the same key from a single in flight promise.",
      "Race condition":
        "Two responses for the same view arriving in an order that lets an older one overwrite a newer one.",
      "Optimistic update":
        "Applying the expected result immediately and rolling back if the server disagrees.",
      "Cache invalidation":
        "Marking keys as needing a refetch after a mutation, so views that depend on them update.",
    },
    body: {
      Beginner: `<p>Data that comes from a server is different from data your component owns. You did not create it, you cannot be certain it is still true, and someone else may change it while you are looking at it. Thinking of it as a copy, rather than as your state, makes almost every decision easier.</p>
<h2>The four states of a fetch</h2>
<p>Every request has four possible outcomes on screen, and a good interface handles all of them: nothing asked for yet, waiting, succeeded with data, failed with a reason. Code that tracks only a loading flag and a data variable will eventually show a spinner forever or an empty list that is actually an error.</p>
<h2>The race, in one paragraph</h2>
<p>A user types <em>ca</em>, then <em>cat</em>. Two requests go out. The network is not fair, so the answer for <em>ca</em> can arrive after the answer for <em>cat</em>. If you simply apply whatever arrives, the screen ends up showing results for what the user typed a moment ago, and nothing about the code looks wrong.</p>
<aside class="tip">The fix is to ignore any answer that is not the one you are currently waiting for. Number your requests, or cancel the previous one before starting the next. Do not try to fix it by making the requests slower or by waiting for the user to stop typing, because that only makes the bug rarer.</aside>
<h2>Do not fetch the same thing twice</h2>
<p>If three components on a page all need the current user, three requests go out for it unless something is holding onto the first. A shared cache, keyed by what was asked for, turns those three into one and makes the second visit to a page instant.</p>
<pre>const key = "user/7";
const cached = cache.get(key);</pre>
<h2>Showing old data while fetching new</h2>
<p>When a user returns to a page you already fetched, showing the old data straight away and quietly refreshing it feels far faster than a spinner, and it is usually correct. Data that is a few seconds out of date is better than no data at all.</p>`,
      Intermediate: `<p>Server data is a cache of somebody else's truth. Once you accept that framing, the design questions become the standard cache questions: what is the key, when is an entry stale, who refreshes it, and what happens when it is wrong.</p>
<h2>Keys decide everything</h2>
<p>A <strong>query key</strong> identifies what was requested, typically the resource and every parameter that changes the answer, including filters, pagination and the identity of the user when responses differ by them. Two components with the same key share one entry and one in flight request, which gives <strong>deduplication</strong> for free. A key that omits a parameter causes two different questions to share an answer, which is a correctness bug rather than a performance one.</p>
<h2>Stale while revalidate</h2>
<p>Distinguish having data from having fresh data. An entry is fresh for a configured period, then <strong>stale</strong>, meaning it is still rendered but should be refreshed when something asks for it again. <strong>Revalidation</strong> then happens in the background with the previous data still on screen, which removes almost every spinner from a returning visit. Choose the freshness window from how fast the data actually changes: a reference list can be minutes, a live counter seconds.</p>
<h2>Races have two remedies</h2>
<p>A <strong>race condition</strong> is inherent to any view that issues a new request before the previous one settles. Both remedies are simple and they compose:</p>
<ul>
<li>Sequence the requests and apply a response only if it is at least as new as the newest already applied. An older response is dropped rather than rendered.</li>
<li>Abort the previous request through an AbortController before issuing the next, so the work stops as well as being ignored.</li>
</ul>
<p>Applying by key rather than globally matters here: two different queries in flight at the same time are not competing, so the guard must be per key or a slow unrelated request will suppress a fast relevant one.</p>
<h2>Mutations and invalidation</h2>
<p>After a write, the cache holds data that is now wrong. Two strategies exist. <strong>Cache invalidation</strong> marks the affected keys stale and lets the next read refetch, which is simple and always correct. An <strong>optimistic update</strong> writes the expected result into the cache immediately, keeps the previous value, and restores it if the server rejects the change, which feels instant and costs a rollback path you must actually implement.</p>
<aside class="tip">Do not copy fetched data into component state. The moment you do, you own a second copy that no invalidation can reach, and the screen will disagree with the cache after the next mutation. Read from the cache in the render and keep only genuinely local things, such as which row is expanded, in state.</aside>`,
      Advanced: `<p>Assume keys, staleness and the race guard. The remaining problems are consistency across views, the shape of the cache under pagination, and what happens when the network is not merely slow but unreliable.</p>
<h2>Normalisation and the list versus detail problem</h2>
<p>A document cache stores each response under its key, so the same entity appears in both a list entry and a detail entry and can disagree after a mutation. A normalised cache stores entities once and lets queries reference them, which keeps views consistent at the cost of needing a schema and a way to know which fields a response supplies. The pragmatic middle is a document cache plus deliberate invalidation of every key a mutation could affect, accepting that the mapping from mutation to keys is knowledge you must maintain.</p>
<h2>Pagination shapes the key</h2>
<ul>
<li>Offset pagination is easy to key and wrong under concurrent inserts, since a row can appear on two pages or none.</li>
<li>Cursor pagination is stable under inserts and cannot jump to an arbitrary page, which changes the interface you can offer.</li>
<li>Infinite lists want one cache entry containing all loaded pages, or a returning user loses their position on every refresh.</li>
<li>Prefetching the next page on hover or on idle converts a visible wait into no wait at all, at the cost of requests that are sometimes wasted.</li>
</ul>
<h2>Failure is a first class case</h2>
<p>Retry only what is safe to retry, which means idempotent reads always and writes only when they carry an idempotency key. Back off exponentially with jitter so recovering clients do not synchronise into a second outage. Distinguish an aborted request, which is expected and must not be reported, from a genuine failure. And decide explicitly what a failed background <strong>revalidation</strong> should do: keeping the previous data and marking it stale is nearly always better than replacing a working screen with an error because a refresh failed.</p>
<aside class="tip">An <strong>optimistic update</strong> needs three things or it will corrupt the cache: a snapshot of the previous value, a rollback on failure, and an invalidation on settle so the server's version wins in the end. Implementations that skip the third look correct until two tabs are open, when the optimistic value quietly persists as truth.</aside>`,
      Expert: `<p>A client side data layer is a replicated cache with no coordination protocol, and that framing predicts its failure modes precisely. Every entry is a snapshot of a value that another party can change, every write is applied twice in two places, and the only consistency you get is what you construct out of invalidation and refetching.</p>
<h2>Ordering is not guaranteed anywhere</h2>
<p>Neither the network, nor HTTP/2 multiplexing, nor the event loop preserves the order in which you issued requests, so a monotonic guard is not an optimisation but a correctness requirement. The guard must be per <strong>query key</strong> and monotonic with respect to issue order, and the subtle version of the bug is a shared guard across keys, where a slow request for one view suppresses a newer response for another. The same reasoning applies to mutations: two writes issued in order can be applied out of order at the server, which is what conditional requests and version fields exist to detect.</p>
<h2>What the popular libraries hide, and what they do not</h2>
<ul>
<li><strong>Deduplication is scoped to a cache instance.</strong> Two providers, or a second tab, are two caches, so anything relying on single flight for correctness rather than efficiency is already wrong.</li>
<li><strong>Structural sharing on refetch is what preserves memoisation.</strong> Replacing an identical response with a new object graph invalidates every downstream comparison, so a background revalidation that changes nothing still rerenders the tree unless the layer diffs and reuses.</li>
<li><strong>Garbage collection timing is user visible.</strong> An entry dropped while its last consumer is unmounted for a moment turns a back navigation into a full spinner, and the fix is a retention window rather than a bigger cache.</li>
<li><strong>Suspense changes the failure surface, not the semantics.</strong> Reading a promise during render moves the loading state into the boundary and leaves races, keys and invalidation exactly where they were.</li>
</ul>
<h2>Designing for the multi tab, multi user reality</h2>
<p>Once two tabs are open, the cache is distributed. Refetching on window focus is a cheap approximation of a subscription and resolves most drift. Where the data genuinely changes under the user, a server sent event or socket that invalidates keys is more honest than polling, and it keeps the same architecture: the transport reports that something changed, and the existing invalidation path does the rest. The property worth protecting throughout is that the server remains authoritative and every client value is either fresh, explicitly stale, or in the process of being corrected.</p>
<aside class="tip">Write down, for each mutation, the exact list of keys it invalidates. That list is the real coupling in the system, it is invisible in the type checker, and it is the thing that breaks when someone adds a new view six months later. A test that performs a mutation and asserts the affected queries refetch is worth more than any number of unit tests around the fetch function.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Guard a cache against out of order responses",
        difficulty: "Medium",
        statement: `<p>Responses do not arrive in the order they were requested, so a cache that applies whatever lands last will show stale data. Implement the monotonic guard that prevents it.</p>
<p>You receive an array of responses <em>in arrival order</em>, each shaped <code>{ key, seq, data }</code>. <code>key</code> identifies the query and <code>seq</code> increases with the order the requests were issued for that key.</p>
<p>Apply a response only when its <code>seq</code> is strictly greater than the highest already applied <strong>for the same key</strong>. Anything else is superseded and must be dropped.</p>
<p>Return <code>{ data, applied, ignored }</code> where:</p>
<ul>
<li><code>data</code> maps each key to its latest applied value, with keys in the order they were first applied.</li>
<li><code>applied</code> and <code>ignored</code> hold the arrival indexes of the responses you applied and dropped, each in ascending order.</li>
</ul>`,
        fn: "latestWins",
        params: "responses",
        tests: [
          {
            args: [
              [
                { key: "user", seq: 1, data: "u1" },
                { key: "orders", seq: 1, data: "o1" },
              ],
            ],
            expected: { data: { user: "u1", orders: "o1" }, applied: [0, 1], ignored: [] },
            label: "basic, two independent keys",
          },
          {
            args: [
              [
                { key: "search", seq: 2, data: "cat" },
                { key: "search", seq: 1, data: "ca" },
              ],
            ],
            expected: { data: { search: "cat" }, applied: [0], ignored: [1] },
            label: "the slow older response is dropped",
          },
          {
            args: [
              [
                { key: "s", seq: 1, data: "x" },
                { key: "s", seq: 1, data: "y" },
              ],
            ],
            expected: { data: { s: "x" }, applied: [0], ignored: [1] },
            label: "duplicate sequence is not newer",
          },
          {
            args: [[]],
            expected: { data: {}, applied: [], ignored: [] },
            label: "empty input",
          },
          {
            args: [
              [
                { key: "a", seq: 5, data: "a5" },
                { key: "b", seq: 1, data: "b1" },
                { key: "a", seq: 4, data: "a4" },
                { key: "b", seq: 2, data: "b2" },
              ],
            ],
            expected: { data: { a: "a5", b: "b2" }, applied: [0, 1, 3], ignored: [2] },
            label: "the guard is per key, not global",
            hidden: true,
          },
        ],
        hints: [
          "One number is not enough. A slow response for one query must not be able to suppress a newer response for a different query.",
          "Track the highest applied sequence per key, and compare with strict greater than so a repeat of the same sequence is treated as superseded.",
          "Insertion order into the data object is the order each key is first applied, which you get for free by assigning as you go rather than sorting at the end.",
        ],
        solution: `function latestWins(responses) {
  var highest = {};
  var data = {};
  var applied = [];
  var ignored = [];

  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var seen = Object.prototype.hasOwnProperty.call(highest, response.key)
      ? highest[response.key]
      : -Infinity;
    if (response.seq > seen) {
      highest[response.key] = response.seq;
      data[response.key] = response.data;
      applied.push(i);
    } else {
      ignored.push(i);
    }
  }

  return { data: data, applied: applied, ignored: ignored };
}`,
        skills: ["Race conditions", "Query keys", "Server state as cache"],
      },
    ],
  },

  5012: {
    topicId: 5012,
    title: "Performance: memo, virtualisation, code splitting",
    summary:
      "Measure before you optimise, then apply the three techniques that actually move the numbers: cutting rendered work, rendering only what is visible, and shipping less JavaScript up front.",
    concepts: [
      "Measurement before optimisation",
      "Memoisation boundaries",
      "List virtualisation",
      "Code splitting",
      "Bundle composition",
      "Perceived performance",
    ],
    glossary: {
      "Memoisation boundary":
        "A component wrapped so it re renders only when its props actually change by shallow comparison.",
      Virtualisation:
        "Rendering only the rows inside the viewport plus a small overscan, while reserving the full scroll height.",
      Overscan:
        "The extra rows rendered above and below the viewport so that fast scrolling does not reveal blank space.",
      "Code splitting":
        "Breaking the bundle into chunks loaded on demand, so the first page does not pay for the whole application.",
      "Long task":
        "A block of main thread work over fifty milliseconds, during which the page cannot respond to input.",
      "Tree shaking":
        "Elimination of unused exports at build time, which only works on static module syntax with no side effects.",
      Skeleton:
        "A placeholder with the shape of the eventual content, which improves perceived speed without changing any timing.",
    },
    body: {
      Beginner: `<p>Performance work goes wrong in a predictable way: someone applies a technique they read about, the page does not get faster, and nobody can say why. The fix is to measure first, and to know which of three very different problems you have.</p>
<h2>The three problems</h2>
<ul>
<li><strong>Too much redrawing.</strong> Typing in one box redraws half the page. The fix is boundaries, so unrelated parts stop redrawing.</li>
<li><strong>Too much on screen.</strong> A list of ten thousand rows creates ten thousand elements, and the browser struggles with all of them. The fix is to draw only the rows you can see.</li>
<li><strong>Too much downloaded.</strong> The page waits several seconds before it can do anything because it is loading code for features nobody has opened. The fix is to split the code and load the rest later.</li>
</ul>
<h2>Measure with the tools you already have</h2>
<p>Open the performance panel, record while you do the slow thing, and look at what took the time. If it is a long stripe of your own code, that is redrawing. If it is a long wait before anything happens, that is downloading. Guessing between the two costs days.</p>
<aside class="tip">Always measure on a throttled connection and with the processor slowed down. Your laptop hides every performance problem your users have, which is why a page can feel instant to the team and unusable in the field.</aside>
<h2>Only visible rows need to exist</h2>
<p>A viewport 400 pixels tall showing rows of 40 pixels can display ten rows. Whatever the list contains, you only ever need about ten in the page, plus a couple above and below so scrolling does not show gaps. The rest is arithmetic: keep a tall empty container so the scrollbar is honest, and move the visible rows to the right position.</p>
<h2>Feeling fast counts</h2>
<p>Showing the shape of the content while it loads, keeping a button responsive while its work happens, and never letting the page jump around as things arrive all make an interface feel quicker without changing a single measurement.</p>`,
      Intermediate: `<p>Optimisation without measurement is a coin toss, and each of the three techniques below addresses a different bottleneck. Applying the wrong one adds complexity and changes nothing.</p>
<h2>Memoisation is a boundary, not a decoration</h2>
<p>Wrapping a component in a memo makes it skip re rendering when its props are shallowly equal. The boundary only holds if every prop is stable, so an inline object, an inline arrow or a freshly derived array passed from the parent breaks it silently. That is why a codebase with a memo on every component often shows no improvement: the boundaries were all leaking. Place a <strong>memoisation boundary</strong> deliberately, at the top of a subtree that is expensive and whose inputs genuinely change rarely, then make the props to it stable.</p>
<h2>Virtualisation is arithmetic</h2>
<p><strong>Virtualisation</strong> replaces a long list with a container of the full height and a window of rendered rows positioned inside it:</p>
<ul>
<li>The first visible index is the scroll offset divided by the row height, rounded down.</li>
<li>The last is the offset plus the viewport height, divided by row height, rounded up.</li>
<li><strong>Overscan</strong> extends both ends by a few rows so quick scrolling does not reveal blanks.</li>
<li>The rendered block is offset by the first index multiplied by the row height, so the scrollbar stays honest.</li>
</ul>
<p>Fixed row heights make this exact. Variable heights require measuring rows as they render and maintaining a running offset, which is where most of the complexity in real implementations comes from.</p>
<h2>Code splitting changes what you pay for at start up</h2>
<p><strong>Code splitting</strong> works along two natural seams: routes, so a page loads only its own code, and heavy components behind an interaction, such as an editor or a chart library that is only needed when a dialog opens. Prefetching the chunk on hover or during idle removes the wait that splitting would otherwise introduce. The measurement that matters is the size of the code required before the page becomes interactive, not the total.</p>
<aside class="tip">Look at the bundle before optimising the code. A single date or icon library imported wholesale frequently outweighs every component in the application, and deleting it is a one line change with a larger effect than a week of memoisation.</aside>
<h2>Perceived speed is real speed</h2>
<p>A <strong>skeleton</strong> that matches the eventual layout, reserved space for images so nothing shifts, and an immediate visible response to every interaction all improve how fast the product feels. They are not a substitute for the work above, but they are the cheapest wins available and they survive on a bad network.</p>`,
      Advanced: `<p>Assume the three techniques. The judgement calls are where a boundary belongs, when virtualisation costs more than it saves, and how to keep splitting from becoming a waterfall.</p>
<h2>The cost of a memoisation boundary</h2>
<p>Every memo adds a shallow comparison per render and retains the previous props. For a cheap component rendered rarely, that comparison is pure overhead, and the compiler based approach now available changes the calculus further by inserting memoisation automatically where it can prove it is safe. Two rules survive regardless: identity discipline in the parent is what makes any boundary work, and passing primitives rather than objects across the boundary removes the problem entirely rather than papering over it. Where a subtree is expensive but its inputs are genuinely volatile, no boundary will help and the correct move is to make the work itself cheaper or to move it off the render path.</p>
<h2>Virtualisation has real costs</h2>
<ul>
<li>Browser find in page cannot see rows that do not exist, and neither can a screen reader unless <code>aria-setsize</code> and <code>aria-posinset</code> are supplied.</li>
<li>Anchoring is delicate. Prepending items above the current scroll position moves the content under the user unless the offset is corrected in the same frame.</li>
<li>Dynamic heights require measurement and cause a correction pass, which is visible as a small jump unless done in a layout effect.</li>
<li>Under a few hundred simple rows, virtualisation usually loses to plain rendering once its own bookkeeping is counted.</li>
</ul>
<h2>Splitting without creating waterfalls</h2>
<p>A lazily loaded component that itself fetches data on mount produces a sequential chain: load chunk, then start request. Prefetching the chunk at the moment the intent becomes likely, and starting the data request in parallel with the chunk load, collapses that chain. Route level splitting has the same hazard where a layout chunk must load before the page chunk is even discovered, which is what module preloading in the document head addresses.</p>
<aside class="tip">Fixing a <strong>long task</strong> matters more than fixing an average. Responsiveness is measured by the worst interaction, not the mean, so one fifty millisecond block on every keystroke ruins a page that looks healthy in aggregate. Break the work, move it to a worker, or do less of it.</aside>`,
      Expert: `<p>Front end performance is a scheduling problem on one thread, and every technique here is a way of removing work from that thread or moving it to a moment when nobody is waiting. Reading it that way makes the priorities obvious: work that blocks input costs the most, work that delays first paint costs next, and everything else is bookkeeping.</p>
<h2>What the field metrics actually measure</h2>
<p>Interaction latency is measured from input to the next paint that reflects it, so it includes the event handler, every render it triggers and the commit, plus anything already queued ahead of it. This is why a page can pass every synthetic benchmark and still feel unresponsive: the benchmark measures throughput, the metric measures the tail. Layout stability is similarly a tail metric, dominated by rare late arriving content rather than by the common case, which is why reserving space for images and advertisements outperforms any amount of render optimisation on that particular number.</p>
<h2>Where the standard advice is incomplete</h2>
<ul>
<li><strong>Memoising everything can be slower.</strong> Comparisons and retained props are not free, and the retained previous props keep object graphs alive, which shifts pressure onto the garbage collector.</li>
<li><strong>Tree shaking is fragile.</strong> It requires static imports, accurate side effect declarations and a package that ships modules rather than a bundled artefact. A single package marked as having side effects can retain everything it imports.</li>
<li><strong>Splitting has a floor.</strong> Each chunk costs a request and a module evaluation, so very fine grained splitting converts a bandwidth problem into a latency problem, and on a high latency link that is a bad trade.</li>
<li><strong>Virtualisation moves cost rather than removing it.</strong> Scrolling now performs work per frame that a plain list did once, so a heavy row component turns a mount cost into a sustained frame cost.</li>
</ul>
<h2>An order of operations that holds up</h2>
<p>Measure on representative hardware, then work down: remove work that blocks the first paint, remove the largest dependencies, split what remains along interaction seams, virtualise anything unbounded, and only then place <strong>memoisation boundaries</strong> where a profile shows a subtree re rendering without cause. Reversing that order is the common failure, because memoisation is the most visible technique in code review and the least likely to be the actual bottleneck.</p>
<aside class="tip">Put a budget in continuous integration. A check that fails the build when the entry chunk grows beyond an agreed size turns performance from an occasional cleanup project into a property the codebase maintains by itself, and it is the only intervention in this topic that does not decay over time.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Compute the visible window of a virtualised list",
        difficulty: "Medium",
        statement: `<p>A virtualised list renders only the rows inside the viewport, plus a little <em>overscan</em> above and below, inside a container tall enough to keep the scrollbar honest. All of it is arithmetic.</p>
<p>Given the total number of rows, a fixed row height, the viewport height, the current scroll offset and the overscan count, return <code>{ start, end, offsetTop }</code> where <code>start</code> is the first index to render, <code>end</code> is <em>exclusive</em>, and <code>offsetTop</code> is the pixel offset to translate the rendered block by.</p>
<ul>
<li>Clamp the scroll offset to the range <code>0</code> to <code>total * itemHeight - viewportHeight</code>, never below zero, so rubber band scrolling does not produce nonsense indexes.</li>
<li><code>start</code> is the clamped offset divided by the row height, rounded down, minus the overscan, never below zero.</li>
<li><code>end</code> is the clamped offset plus the viewport height, divided by the row height, rounded up, plus the overscan, never above the total.</li>
<li><code>offsetTop</code> is <code>start * itemHeight</code>.</li>
<li>With no rows at all, return zero for all three.</li>
</ul>`,
        fn: "visibleRange",
        params: "total, itemHeight, viewportHeight, scrollTop, overscan",
        tests: [
          {
            args: [1000, 40, 400, 0, 2],
            expected: { start: 0, end: 12, offsetTop: 0 },
            label: "top of a long list",
          },
          {
            args: [1000, 40, 400, 1000, 2],
            expected: { start: 23, end: 37, offsetTop: 920 },
            label: "scrolled into the middle",
          },
          {
            args: [1000, 40, 400, 100, 0],
            expected: { start: 2, end: 13, offsetTop: 80 },
            label: "no overscan, partial rows at both edges",
          },
          {
            args: [0, 40, 400, 0, 2],
            expected: { start: 0, end: 0, offsetTop: 0 },
            label: "empty list",
          },
          {
            args: [10, 40, 400, 5000, 1],
            expected: { start: 0, end: 10, offsetTop: 0 },
            label: "content shorter than the viewport",
          },
          {
            args: [100, 50, 300, -120, 0],
            expected: { start: 0, end: 6, offsetTop: 0 },
            label: "rubber band scroll above the top",
          },
          {
            args: [5, 100, 250, 180, 1],
            expected: { start: 0, end: 5, offsetTop: 0 },
            label: "overscan clamped at both ends",
            hidden: true,
          },
        ],
        hints: [
          "Clamp the scroll offset before you compute anything from it, otherwise every later line has to defend itself against a negative or oversized value.",
          "The first index rounds down and the last rounds up, because a row is visible if any part of it is inside the viewport.",
          "offsetTop must be derived from the final start index after clamping and overscan, not from the raw scroll offset, or the rendered block will sit in the wrong place.",
        ],
        solution: `function visibleRange(total, itemHeight, viewportHeight, scrollTop, overscan) {
  if (total <= 0) return { start: 0, end: 0, offsetTop: 0 };

  var maxScroll = Math.max(0, total * itemHeight - viewportHeight);
  var offset = Math.min(Math.max(0, scrollTop), maxScroll);

  var first = Math.floor(offset / itemHeight) - overscan;
  var last = Math.ceil((offset + viewportHeight) / itemHeight) + overscan;

  var start = Math.max(0, first);
  var end = Math.min(total, last);

  return { start: start, end: end, offsetTop: start * itemHeight };
}`,
        skills: ["List virtualisation", "Measurement before optimisation", "Perceived performance"],
      },
    ],
  },

  5013: {
    topicId: 5013,
    title: "Designing a REST API you will not regret",
    summary:
      "Design resources, error shapes and evolution rules so that clients you will never meet can build against your interface without breaking every time you deploy.",
    concepts: [
      "Resource modelling",
      "Consistent error shapes",
      "Pagination and filtering",
      "Versioning and evolution",
      "Idempotent writes",
      "Documentation as contract",
    ],
    glossary: {
      Resource:
        "A noun in your domain that has an address, as opposed to an action, which is expressed by the method.",
      "Collection endpoint":
        "An address representing a set of resources, supporting listing with filters and creation.",
      "Cursor pagination":
        "Paging by an opaque marker pointing at a position in an ordered set, stable when rows are inserted.",
      "Problem document":
        "A single machine readable error shape carrying a stable type identifier, a title and optional field details.",
      "Idempotency key":
        "A client generated identifier that lets the server recognise a retried write and return the original outcome.",
      "Additive change":
        "A change that only adds optional fields or new endpoints, and therefore cannot break a well behaved client.",
      "Envelope":
        "A wrapper object around a response body carrying metadata such as paging information alongside the data.",
    },
    body: {
      Beginner: `<p>An API is a promise to people you will never meet. They will read it once, write code against it, and expect that code to keep working. Almost everything in good API design follows from taking that seriously.</p>
<h2>Nouns in the path, verbs in the method</h2>
<p>The address names a thing. What you are doing to it is already expressed by the method.</p>
<ul>
<li><code>GET /orders</code> lists orders.</li>
<li><code>POST /orders</code> creates one and answers <code>201</code> with its address.</li>
<li><code>GET /orders/42</code> fetches one.</li>
<li><code>DELETE /orders/42</code> removes it.</li>
</ul>
<p>An address such as <code>/createOrder</code> or <code>/getOrderById</code> duplicates in the path something the method already says, and it means every client has to learn your naming instead of applying what they already know.</p>
<h2>Be boringly consistent</h2>
<p>Pick one style and never vary it. If identifiers are called <code>id</code>, they are called <code>id</code> everywhere. If timestamps are in one format, they are in that format everywhere. If lists are wrapped in an object, they are wrapped everywhere. Each inconsistency is a small tax on every developer who uses you, and they add up.</p>
<h2>Errors need a shape</h2>
<p>Returning a plain string for one failure and an object for another means every client writes a guessing routine. One shape, always, with a code they can branch on and a message a human can read.</p>
<pre>{ "type": "order_already_paid",
  "title": "This order has already been paid",
  "status": 409 }</pre>
<aside class="tip">Never return an unbounded list. A collection that returns everything works perfectly for a year and then takes thirty seconds when one customer has a hundred thousand rows. Put paging in from the first day, even if the default page is large.</aside>`,
      Intermediate: `<p>The design decisions that cause regret are not the ones about naming. They are the ones that make change impossible, make errors unhandleable, or make correct client behaviour depend on undocumented knowledge.</p>
<h2>Model resources, not screens</h2>
<p><strong>Resource modelling</strong> that follows the current interface produces endpoints such as <code>/dashboardData</code>, which cannot be reused, cached or evolved. Model the domain instead, expose relationships as sub collections such as <code>/orders/42/lines</code>, and let clients compose. Where a genuinely composite response is needed for performance, add it as an explicit, documented aggregate rather than by bending an existing resource.</p>
<p>Actions that are not creation, replacement or deletion do not force a verb into the path. Prefer a state transition on the resource, or a sub resource that represents the action's record, for example <code>POST /orders/42/refunds</code>, which is itself a thing that can be listed and inspected later.</p>
<h2>One error shape</h2>
<p>A <strong>problem document</strong> gives every failure the same structure: a stable machine readable type, a human readable title, the status, and where applicable a list of field level errors. The stability of the type string is the whole value. Clients branch on it, and it must therefore never be reworded, unlike the title which may change freely.</p>
<h2>Pagination and filtering</h2>
<ul>
<li>Offset paging is simple and drifts when rows are inserted, so an item can be seen twice or missed.</li>
<li><strong>Cursor pagination</strong> is stable under insertion, gives predictable performance regardless of depth, and cannot offer arbitrary page numbers.</li>
<li>Filters belong in the query string, with one documented syntax rather than a different convention per endpoint.</li>
<li>Sorting must be total. Sorting by a non unique column without a tie break produces a non deterministic order and duplicated rows across pages.</li>
</ul>
<h2>Evolution without breakage</h2>
<p>Most change should be <strong>additive</strong>: new optional fields, new endpoints, new enum members that clients are told to ignore when unknown. Reserve a version bump for a genuine break, and expect to run both versions for as long as clients exist. The rule that makes this work is stated in the documentation and enforced in review: clients must ignore unknown fields, and servers must never repurpose an existing one.</p>
<aside class="tip">Write the client before you finalise the interface. Ten minutes consuming your own API surfaces missing identifiers, awkward paging and errors you cannot act on, all of which are cheap to change before release and expensive afterwards.</aside>`,
      Advanced: `<p>Assume resources and error shapes. What determines whether an API ages well is how it handles concurrency, partial failure and the long tail of clients you cannot upgrade.</p>
<h2>Writes need identity and preconditions</h2>
<p><strong>Idempotent writes</strong> are not optional in a world with mobile clients and retrying proxies. Creation takes an idempotency key, stored with the response in the same transaction as the effect, so a retry replays the original status and body rather than creating a second record. Updates take a precondition, either an ETag with <code>If-Match</code> or a version field in the payload, so a stale client is rejected with a conflict rather than silently overwriting a change it never saw. Both mechanisms turn an invisible data corruption into a visible, handleable error.</p>
<h2>Designing for partial and asynchronous work</h2>
<ul>
<li>Long operations should answer <code>202</code> with a link to a status resource rather than holding a connection open for minutes.</li>
<li>Bulk endpoints must define their failure semantics precisely: all or nothing, or per item results. A bulk call that half succeeds without saying which half is unusable.</li>
<li>Rate limits belong in headers on every response, not only on the rejection, so a client can pace itself before being refused.</li>
<li>Every list response should carry the paging state needed to continue, so clients never construct cursors themselves.</li>
</ul>
<h2>Compatibility is a contract you enforce</h2>
<p>Treat the schema as an artefact under version control, generate it from the implementation or the implementation from it, and run a compatibility check in continuous integration that fails on a removed field, a narrowed type or a newly required request property. Deprecation then becomes a process rather than an announcement: mark the field, measure who still reads it, notify them, and remove it only when the number reaches zero. Without measurement, deprecation is a guess and removal is an outage.</p>
<aside class="tip">Nullable and absent are different, and choosing between them is a design decision rather than an implementation detail. An absent field means not supplied; a null field means known to be empty. Mixing the two forces every client to write the same defensive check on every field, and it makes patch semantics ambiguous.</aside>`,
      Expert: `<p>An API is a distributed system's public type, and the properties that matter are the ones that survive independent deployment: compatibility, idempotency and observability. Style questions are settled by consistency alone, whereas these three decide whether the interface can change at all.</p>
<h2>Compatibility as a formal property</h2>
<p>A change is backwards compatible when every message a conforming old client can send is still accepted, and every message it can receive is still understood. That definition permits adding optional request fields and response fields, and forbids narrowing a type, adding a required field, removing an enum member or changing a default. It also exposes a subtlety the informal rule misses: adding a value to an enum is compatible only if clients were told to tolerate unknown values, which makes it a documentation decision taken at design time rather than a schema decision taken at change time.</p>
<h2>Where common practice quietly hurts</h2>
<ul>
<li><strong>Envelopes are load bearing or they are noise.</strong> Wrapping every response in a data field is justified when paging or partial errors must travel alongside; where nothing else is carried, it costs every client an extra unwrapping step forever.</li>
<li><strong>Hypermedia is rarely consumed.</strong> Links in responses are valuable for cursors, where the server owns the encoding, and largely ignored elsewhere, so the pragmatic subset is to return next and previous links and to skip the full discoverability apparatus.</li>
<li><strong>Version in the path is a coarse instrument.</strong> It bumps everything to change one resource, and it fragments caches. Sunsetting individual representations through negotiation is finer grained, at the price of a cache key that varies.</li>
<li><strong>Filtering languages become query engines.</strong> A generic filter syntax over arbitrary fields eventually admits requests no index can serve, so constrain the filterable set to what you can serve within your latency budget and reject the rest explicitly.</li>
</ul>
<h2>The contract includes the failures</h2>
<p>Documented behaviour under failure is part of the interface: which operations are safe to retry, what the rate limit policy is, how long a cursor remains valid, and what happens when it does not. Clients derive their reliability from these guarantees, and an undocumented one becomes a de facto promise the moment someone depends on it. Writing them down as <strong>documentation as contract</strong>, generated from the same source as the schema and verified by tests, is the difference between an API you can change and one that is frozen by its own success.</p>
<aside class="tip">Instrument by client and by operation from the first release. Knowing which integrations call which endpoints, at what version and at what rate, is what makes every later decision about deprecation, rate limiting and capacity a matter of fact rather than of negotiation.</aside>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Which endpoint design best follows resource modelling for creating an order?",
        options: [
          "POST /createOrder",
          "POST /orders",
          "GET /orders/new",
          "POST /orders/create",
        ],
        answer: 1,
        explanation:
          "The path names the collection and the method expresses the action, which is the convention every client already knows and every intermediary already understands. Putting the verb in the path duplicates what POST already says and forces each consumer to learn your private naming scheme.",
        difficulty: "Easy",
        skill: "Resource modelling",
      },
      {
        n: 2,
        question:
          "Why should a list endpoint paginate from the very first release?",
        options: [
          "Because clients cannot parse large JSON documents",
          "Because an unbounded collection works until one account grows, then times out with no way to fix it compatibly",
          "Because HTTP limits response size",
          "Because pagination is required for caching to work",
        ],
        answer: 1,
        explanation:
          "The failure arrives late and is unfixable without breaking clients, since adding paging afterwards changes the response shape everyone already depends on. The idea that HTTP imposes a size limit is a common misconception: nothing stops a huge response except the time it takes to build and transfer.",
        difficulty: "Easy",
        skill: "Pagination and filtering",
      },
      {
        n: 3,
        question:
          "What is the most important property of the machine readable type field in an error response?",
        options: [
          "That it is human readable",
          "That it never changes once published, because clients branch on it",
          "That it matches the HTTP status code",
          "That it is unique per request",
        ],
        answer: 1,
        explanation:
          "Clients switch on the type to decide behaviour, so rewording it breaks them exactly as removing a field would, while the human readable title may be improved freely. Making it unique per request confuses the error type with a correlation identifier, which is a separate and also useful field.",
        difficulty: "Medium",
        skill: "Consistent error shapes",
      },
      {
        n: 4,
        question:
          "A list is sorted by created date, which is not unique, and paged by offset. What goes wrong?",
        options: [
          "Nothing, dates are sufficiently unique in practice",
          "Rows with equal dates can order differently between requests, so items are duplicated or skipped across pages",
          "The database refuses a non unique sort",
          "Offsets become negative",
        ],
        answer: 1,
        explanation:
          "Without a tie break the order among equal values is unspecified, so a second query can interleave them differently and a row can appear on two pages or none. Trusting that timestamps are unique enough is the tempting shortcut, and it fails precisely when rows are created in bulk.",
        difficulty: "Medium",
        skill: "Pagination and filtering",
      },
      {
        n: 5,
        question:
          "Which change to an existing endpoint is backwards compatible?",
        options: [
          "Adding a new required field to the request body",
          "Adding a new optional field to the response body",
          "Narrowing a field's type from string to enum",
          "Renaming a response field and keeping the old one as a copy for one release",
        ],
        answer: 1,
        explanation:
          "An added optional response field is invisible to a client that ignores unknown fields, which is the rule such clients are told to follow. Renaming with a temporary duplicate feels safe but is still a break at the moment the old name is removed, and it moves the failure to a release nobody associates with the change.",
        difficulty: "Medium",
        skill: "Versioning and evolution",
      },
      {
        n: 6,
        question:
          "A refund is neither a creation of the order nor a replacement of it. What is the cleanest design?",
        options: [
          "POST /orders/42/refund with an empty body",
          "POST /refundOrder with the order id in the body",
          "POST /orders/42/refunds, creating a refund resource that can then be listed and inspected",
          "PATCH /orders/42 with a status field of refunded",
        ],
        answer: 2,
        explanation:
          "Treating the refund as a resource gives it an address, a history and a natural place for its own fields, and it makes repeated refunds representable. Patching a status field is the tempting minimal option, but it discards everything about the refund itself, including when it happened and who authorised it.",
        difficulty: "Hard",
        skill: "Resource modelling",
      },
      {
        n: 7,
        question:
          "Two clients read the same record and both submit an update. Which server side design surfaces the conflict rather than losing one edit?",
        options: [
          "Requiring an If-Match precondition or a version field, and answering with a conflict when it does not hold",
          "Timestamping each write and keeping the later one",
          "Locking the record for five minutes after any read",
          "Requiring clients to send only the fields they changed",
        ],
        answer: 0,
        explanation:
          "A precondition makes the client state which version it edited, so a stale write is rejected and can be retried against fresh data. Last write wins by timestamp is the tempting simple rule and is exactly the lost update it appears to solve, since the loser is never told anything happened.",
        difficulty: "Hard",
        skill: "Idempotent writes",
      },
      {
        n: 8,
        question:
          "Why must adding a new value to an enum be treated as a design time decision rather than a routine change?",
        options: [
          "Enums cannot be extended once published",
          "It is compatible only if clients were told in advance to tolerate unknown values",
          "Enum values are cached by intermediaries",
          "New values require a new endpoint",
        ],
        answer: 1,
        explanation:
          "A client that switches exhaustively over the known values will fail on an unfamiliar one, so the compatibility of the change depends entirely on a rule published before the first release. Assuming enums simply cannot be extended overstates it: with the tolerance rule documented and followed, extension is routine.",
        difficulty: "Hard",
        skill: "Versioning and evolution",
      },
    ],
  },

  5014: {
    topicId: 5014,
    title: "Relational modelling and normalisation",
    summary:
      "Turn a fuzzy domain into tables whose constraints make bad data impossible, and understand normalisation well enough to know when to apply it and when to stop.",
    concepts: [
      "Entities and relationships",
      "Functional dependency",
      "Normal forms",
      "Keys and constraints",
      "Referential integrity",
      "Deliberate denormalisation",
    ],
    glossary: {
      "Primary key":
        "The column or columns that uniquely identify a row and are never null.",
      "Foreign key":
        "A column referencing another table's key, which the database enforces so an orphaned row cannot exist.",
      "Functional dependency":
        "A rule that one set of columns determines another, so equal values on the left imply equal values on the right.",
      "Second normal form":
        "Reached when no non key column depends on only part of a composite key.",
      "Third normal form":
        "Reached when no non key column depends on another non key column.",
      "Junction table":
        "The table that resolves a many to many relationship into two one to many relationships.",
      "Update anomaly":
        "A defect where one fact stored in many rows can be changed in some of them and not others.",
      Denormalisation:
        "Deliberately storing a duplicate for performance, accepting the obligation to keep it correct.",
    },
    body: {
      Beginner: `<p>A relational database stores facts in tables and lets you state rules that the data must obey. The rules are the point: a well designed schema makes wrong data impossible to insert rather than merely unlikely.</p>
<h2>One table per kind of thing</h2>
<p>Customers go in a customers table. Orders go in an orders table. An order belongs to a customer, so the orders table holds the customer's identifier rather than a copy of their details.</p>
<pre>customers(id, name, city)
orders(id, customer_id, placed_at)</pre>
<p>That <code>customer_id</code> is a foreign key. Declaring it tells the database to refuse an order pointing at a customer who does not exist, and to refuse deleting a customer who still has orders unless you say what should happen instead.</p>
<h2>Why not just put everything in one table</h2>
<p>Suppose every order row also stored the customer's city. A customer with forty orders has their city written forty times. Now they move.</p>
<ul>
<li>You must update forty rows, and if you update thirty nine the data now contradicts itself.</li>
<li>A customer with no orders has nowhere to live at all.</li>
<li>Deleting their last order deletes the only record of where they live.</li>
</ul>
<p>Those three problems are called update, insertion and deletion anomalies, and avoiding them is what normalisation means.</p>
<aside class="tip">A many to many relationship, such as students and courses, needs a third table holding pairs of identifiers. Trying to store a list of course identifiers in a column removes the database's ability to enforce or search anything about it.</aside>
<h2>The rule of thumb</h2>
<p>Store each fact once, in the table describing the thing it is a fact about. If you find the same value repeated across many rows and changing in step, it belongs somewhere else.</p>`,
      Intermediate: `<p>Normalisation is not an aesthetic. It is a mechanical procedure for removing the redundancy that makes data contradict itself, and it is driven by one idea: which columns determine which others.</p>
<h2>Functional dependency</h2>
<p>A <strong>functional dependency</strong> says that whenever two rows agree on column A they must agree on column B, written A determines B. In a table of order lines, the product code determines the product name, because the same code always names the same product. The key of a well formed table determines everything else in it, and nothing else determines anything.</p>
<h2>The three forms that matter</h2>
<ul>
<li><strong>First normal form</strong>: every column holds a single value. No comma separated lists, no repeating groups of columns such as phone1 and phone2.</li>
<li><strong>Second normal form</strong>: no non key column depends on only part of a composite key. In a table keyed on order and line number, the product name depends on the product alone, so it does not belong there.</li>
<li><strong>Third normal form</strong>: no non key column depends on another non key column. If the table holds a customer identifier and a customer city, the city depends on the customer rather than on the key, so it belongs in the customers table.</li>
</ul>
<p>The informal summary is that every non key column must depend on the key, the whole key, and nothing but the key. Most schemas that reach third normal form are correct enough to stop there.</p>
<h2>Constraints are the enforcement</h2>
<p>A model that exists only in a diagram is a suggestion. Declaring it makes it real: primary keys, foreign keys with an explicit delete rule, unique constraints on natural identifiers such as an email address, not null on anything mandatory, and check constraints for value ranges. Every constraint you decline to declare becomes a defensive check duplicated in every piece of application code, and the one place that forgets it is the one that corrupts the data.</p>
<h2>Relationships in practice</h2>
<p>One to many is a foreign key on the many side. Many to many is a <strong>junction table</strong> whose primary key is the pair, which also prevents duplicate pairs for free. One to one is usually a sign that two tables should be one, unless the split is deliberate, for example to isolate rarely read large columns.</p>
<aside class="tip">Normalise first and denormalise later, with evidence. <strong>Denormalisation</strong> is a valid decision once a measured query cannot meet its budget, and it is an obligation rather than a shortcut: something must now keep the copy correct, and that something should be a trigger or a scheduled reconciliation rather than a hope.</aside>`,
      Advanced: `<p>Assume the normal forms. The interesting decisions are about keys, temporal data and the places where the relational model needs help from the application.</p>
<h2>Key selection has consequences</h2>
<p>A surrogate key is stable and opaque, and it lets natural identifiers change without cascading. A natural key removes a join when the child only ever needs the identifier, at the cost of a wide index and a painful migration when the natural value turns out to be mutable, which it usually does. Sequential integers leak volume and ordering; random identifiers do not, and scatter index writes across the tree, which is why time ordered identifiers exist as a compromise. Whichever you pick, declare the natural identifier as a unique constraint anyway, since it is the only thing preventing genuine duplicates.</p>
<h2>Modelling change over time</h2>
<ul>
<li>An order line must record the price at the time of sale, not a reference to the current product price. This looks like redundancy and is not: it is a different fact.</li>
<li>Soft deletion with a flag interacts badly with unique constraints, because deleted rows still occupy the natural identifier. A partial unique index over live rows fixes it.</li>
<li>History tables or validity ranges answer what did this look like on that date, which no amount of normalisation of the current state can reconstruct.</li>
<li>Status columns that also imply timing invite contradiction. Recording the transitions and deriving the status is harder to get wrong.</li>
</ul>
<h2>Where the model needs help</h2>
<p>Constraints spanning several rows or tables cannot always be expressed declaratively, and the usual candidates are budget totals, non overlapping bookings and per tenant limits. Exclusion constraints handle overlapping ranges natively where available. Everything else needs a transaction with an appropriate isolation level or an explicit lock, because a check followed by an insert in read committed is a race, not a constraint. Recognising which invariants your database cannot enforce, and writing them down, is the difference between a schema that guards its data and one that documents its intentions.</p>
<aside class="tip">Multi tenant schemas deserve a tenant identifier in every table and, where the database supports it, row level security. Relying on every query to remember a where clause is the single most common source of cross tenant data leaks, and the failure is silent until somebody notices another company's rows.</aside>`,
      Expert: `<p>Normalisation is a theory of redundancy elimination built on dependency preservation and lossless decomposition. The normal forms are consequences, not rules to be memorised: each one removes a class of anomaly by ensuring that every determinant of a dependency is a candidate key.</p>
<h2>Beyond third normal form</h2>
<p>Boyce Codd normal form tightens the condition to every determinant being a superkey, which matters in tables with overlapping candidate keys, a scheduling table being the standard example. Fourth normal form addresses multivalued dependencies, where two independent multivalued facts about the same entity in one table produce a cartesian product of rows, so a person's languages and their certifications must be separate tables rather than one. Fifth normal form covers join dependencies that only decompose into three or more relations, which is rare in application schemas and common in the reporting layer that grows out of them. The practical guidance is not to memorise these but to recognise their symptom: rows whose count is a product rather than a sum of independent facts.</p>
<h2>What the standard treatment omits</h2>
<ul>
<li><strong>Decomposition can lose dependencies.</strong> A split that is lossless with respect to data may make a <strong>functional dependency</strong> unenforceable without a join, at which point the constraint has quietly moved into application code.</li>
<li><strong>Nulls interact badly with the theory.</strong> Three valued logic means a null never equals a null, so a unique constraint permits many null rows and a not in subquery returns nothing when the set contains a null. Modelling optionality as a separate table avoids both.</li>
<li><strong>Semi structured columns are not an escape.</strong> A document column is a nested relation with no declared constraints, so every invariant inside it is enforced by whichever code happens to write it. It earns its place for genuinely sparse or client defined attributes, and nowhere else.</li>
<li><strong>Normalisation is not a performance position.</strong> Joins on indexed keys are cheap and the write amplification of duplicated data is not. The cases where denormalisation wins are specific and measurable, typically wide read heavy aggregates, and they should be built as derived structures rather than by degrading the source of truth.</li>
</ul>
<h2>The schema as the last line of defence</h2>
<p>Applications are rewritten, migrated between languages and accessed by scripts nobody remembers. The database outlives all of it, so every invariant expressed as a constraint is enforced for the lifetime of the data, and every invariant expressed only in application code holds until the next importer. That asymmetry is the whole argument for pushing <strong>referential integrity</strong>, uniqueness and check constraints as far down as they will go, and for treating a schema migration as the most carefully reviewed change in the repository.</p>
<aside class="tip">Derive dependencies from real data before trusting a diagram. Scanning a table for columns that determine other columns routinely reveals a rule nobody documented and, just as often, a rule the data violates in a handful of rows. Both are worth knowing before the constraint is added, not after it fails to apply.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Detect third normal form violations in real data",
        difficulty: "Hard",
        statement: `<p>A table is in third normal form when no non key column determines another non key column. You can look for violations in the data itself: if two rows ever agree on column A, then a genuine dependency requires them to agree on column B as well.</p>
<p>You receive an array of row objects and the array of column names forming the primary key. Report every dependency between <em>non key</em> columns.</p>
<ul>
<li>The table's columns are the keys of the first row.</li>
<li>Skip any determinant whose values are distinct in every row: it behaves as a key in this sample, so it trivially determines everything and tells you nothing.</li>
<li>Otherwise report <code>"A -> B"</code> for every ordered pair of distinct non key columns where all rows sharing an A value also share one B value. Dependencies can hold in both directions, and both should be reported.</li>
<li>Return the strings sorted, and an empty array when there are no rows.</li>
</ul>
<p>Compare values with strict equality. Every column in the tests holds a string or a number.</p>`,
        fn: "transitiveDependencies",
        params: "rows, keyColumns",
        tests: [
          {
            args: [
              [
                { orderId: 1, customerId: "c1", customerCity: "Leeds", product: "desk" },
                { orderId: 2, customerId: "c1", customerCity: "Leeds", product: "lamp" },
                { orderId: 3, customerId: "c2", customerCity: "Leeds", product: "desk" },
                { orderId: 4, customerId: "c3", customerCity: "Hull", product: "chair" },
                { orderId: 5, customerId: "c3", customerCity: "Hull", product: "desk" },
              ],
              ["orderId"],
            ],
            expected: ["customerId -> customerCity"],
            label: "city belongs to the customer, not the order",
          },
          {
            args: [
              [
                { orderId: 1, lineNo: 1, productName: "desk", productPrice: 250, qty: 1 },
                { orderId: 1, lineNo: 2, productName: "lamp", productPrice: 40, qty: 2 },
                { orderId: 2, lineNo: 1, productName: "desk", productPrice: 250, qty: 3 },
                { orderId: 2, lineNo: 2, productName: "chair", productPrice: 90, qty: 1 },
              ],
              ["orderId", "lineNo"],
            ],
            expected: ["productName -> productPrice", "productPrice -> productName"],
            label: "composite key, dependency in both directions",
          },
          {
            args: [
              [
                { id: 1, email: "a@example.test", city: "Leeds" },
                { id: 2, email: "b@example.test", city: "Hull" },
              ],
              ["id"],
            ],
            expected: [],
            label: "columns unique in every row are skipped",
          },
          {
            args: [[], ["id"]],
            expected: [],
            label: "empty table",
          },
          {
            args: [
              [
                { id: 1, status: "open" },
                { id: 2, status: "open" },
                { id: 3, status: "shut" },
              ],
              ["id"],
            ],
            expected: [],
            label: "a single non key column cannot violate anything",
            hidden: true,
          },
        ],
        hints: [
          "A dependency is a claim about groups: gather the rows by the determinant's value and ask whether each group is unanimous about the dependent column.",
          "Check the skip rule before doing any grouping work, since a column whose values are all distinct puts every row in its own group and would pass every test vacuously.",
          "Order the pairs deliberately: A determining B is a different claim from B determining A, so both directions must be examined and both can hold.",
        ],
        solution: `function transitiveDependencies(rows, keyColumns) {
  if (!rows.length) return [];

  var columns = Object.keys(rows[0]);
  var nonKey = columns.filter(function (c) { return keyColumns.indexOf(c) === -1; });
  var found = [];

  for (var a = 0; a < nonKey.length; a++) {
    var left = nonKey[a];

    var seen = new Set();
    for (var r = 0; r < rows.length; r++) seen.add(rows[r][left]);
    if (seen.size === rows.length) continue;

    for (var b = 0; b < nonKey.length; b++) {
      var right = nonKey[b];
      if (right === left) continue;

      var groups = new Map();
      var holds = true;
      for (var i = 0; i < rows.length; i++) {
        var determinant = rows[i][left];
        var dependent = rows[i][right];
        if (groups.has(determinant)) {
          if (groups.get(determinant) !== dependent) { holds = false; break; }
        } else {
          groups.set(determinant, dependent);
        }
      }
      if (holds) found.push(left + " -> " + right);
    }
  }

  return found.sort();
}`,
        skills: ["Functional dependency", "Normal forms", "Entities and relationships"],
      },
    ],
  },

  5015: {
    topicId: 5015,
    title: "Indexes, query plans and the N+1 problem",
    summary:
      "Read a query plan, choose indexes that the planner will actually use, and recognise the access pattern that turns one page load into several hundred queries.",
    concepts: [
      "Index structure and ordering",
      "Left prefix rule",
      "Selectivity",
      "Query plans",
      "The N+1 problem",
      "Covering indexes",
    ],
    glossary: {
      "B-tree index":
        "The ordered structure behind most indexes, which supports equality, range and prefix lookups but not arbitrary substring matching.",
      "Left prefix rule":
        "A composite index can serve a query only through a leading run of its columns, so the column order decides what it is useful for.",
      Selectivity:
        "The fraction of rows a predicate keeps, which is what decides whether using an index beats scanning.",
      "Sequential scan":
        "Reading every row of a table, which is the correct choice when a predicate matches a large share of them.",
      "Covering index":
        "An index containing every column a query needs, so the answer comes from the index alone with no table access.",
      "N+1 problem":
        "Issuing one query for a list and then one more per row, so cost grows with the size of the result.",
      "Query plan":
        "The execution strategy the planner chose, showing access methods, join order and its own row estimates.",
    },
    body: {
      Beginner: `<p>A database with no index answers a question by reading every row, which is fine for a hundred rows and hopeless for a million. An index is a sorted structure that lets it jump straight to the rows it wants.</p>
<h2>The phone book analogy, used carefully</h2>
<p>An index sorted by surname then first name lets you find everyone called Patel, and then Priya Patel among them. It does not help at all if you only know the first name, because the book is not sorted that way. This is the single most important fact about multi column indexes: the order of the columns decides which questions they can answer.</p>
<h2>Indexes are not free</h2>
<p>Every index must be updated on every insert, update and delete, and it occupies disk and memory. Indexing every column is a common beginner move that makes reads faster and writes slower, sometimes dramatically. Index what you actually filter, join and sort by.</p>
<h2>Ask the database what it did</h2>
<p>Putting <code>EXPLAIN</code> before a query prints the plan it intends to use. The word to look for is a scan of the whole table where you expected an index lookup. That one habit turns performance work from guessing into reading.</p>
<aside class="tip">A query that wraps a column in a function, such as lowercasing an email before comparing it, cannot use an ordinary index on that column, because the index stores the original values. Either store the value in the form you search by, or build an index on the expression itself.</aside>
<h2>The mistake that hides in tidy code</h2>
<p>You fetch fifty orders, then loop over them and fetch each order's customer. That is one query plus fifty more, and it looks perfectly reasonable in the code. Fetch all fifty customers in a single query using their identifiers instead, and the page goes from fifty one round trips to two.</p>`,
      Intermediate: `<p>Query performance is decided by two things: whether an access method exists that matches the query's shape, and whether the planner believes it is worth using. Both are inspectable.</p>
<h2>Composite indexes and the left prefix rule</h2>
<p>An index on (tenant_id, status, created_at) is a single sorted structure ordered by all three columns in that sequence. The <strong>left prefix rule</strong> follows directly: it can serve a query filtering on tenant alone, or tenant and status, or all three, but not one filtering on status alone. A range or sort on a column can be served by the column immediately after the equality columns, which is why placing the equality predicates first and the sort column last so often removes an explicit sort step from the plan.</p>
<h2>Selectivity decides whether an index wins</h2>
<p>Using an index means walking the index and then fetching matching rows, which is random access. A <strong>sequential scan</strong> reads the table in order, which is far faster per row. So when a predicate matches a large fraction of the table, the scan is genuinely the better plan and the planner is right to choose it. <strong>Selectivity</strong> is therefore the deciding factor, and it is why an index on a boolean column with a ninety percent true rate does almost nothing while a partial index on the ten percent minority does a great deal.</p>
<h2>Reading a plan</h2>
<ul>
<li>Compare the estimated row count with the actual one. A large discrepancy means the statistics are stale or the predicate is beyond the planner's model, and every decision above it in the plan is suspect.</li>
<li>Note the access method: sequential scan, index scan, index only scan, bitmap heap scan.</li>
<li>Note the join strategy: nested loop is right for small inputs, hash join for large unsorted ones, merge join for sorted ones.</li>
<li>Look for a sort node that could be removed by an index whose ordering matches the requested one.</li>
</ul>
<h2>The N+1 problem</h2>
<p>The <strong>N+1 problem</strong> is an access pattern, not a slow query. Each individual query is fast, so it never appears in a slow query log, and the cost only shows as latency proportional to the number of rows displayed. The remedies are a join, a second query with an <code>IN</code> list over the collected identifiers, or a batching layer that collects identifiers within a tick and issues one query. Object relational mappers make this easy to write accidentally, since a property access can silently become a query.</p>
<aside class="tip">A <strong>covering index</strong> that includes every column a query reads lets the database answer from the index alone, skipping the table entirely. It is the difference between two structures being touched and one, and it is often the last available win on a query that is already using an index.</aside>`,
      Advanced: `<p>Assume plans and index shapes. The remaining depth is in statistics, index maintenance and the failure modes that only appear at production scale.</p>
<h2>The planner is an estimator</h2>
<p>Every choice comes from estimated cardinalities, and estimates degrade in predictable ways: correlated predicates are assumed independent, which underestimates a filter on city and postcode together; expressions and functions default to fixed guesses; and inequality on a skewed column depends on histogram resolution. Extended statistics, expression indexes and occasionally a rewrite that gives the planner a shape it models better are the available remedies. Reading estimated against actual rows at every node is how you find which assumption failed, and it is much more informative than the total time at the top.</p>
<h2>Index maintenance is a real cost</h2>
<ul>
<li>Each index multiplies write amplification, and a table with ten indexes can spend more time maintaining them than writing rows.</li>
<li>Random identifiers scatter insertions across the tree, causing page splits and bloat that sequential or time ordered keys avoid.</li>
<li>Partial indexes over the rows that matter, such as active records only, keep the structure small and the write cost proportional to the relevant subset.</li>
<li>Unused indexes are pure cost, and every mature database exposes usage counters that will identify them.</li>
</ul>
<h2>Batching beyond the naive fix</h2>
<p>Replacing an N+1 with a join can introduce a different problem: a one to many join multiplies parent rows by children, so a list of fifty orders with twenty lines each returns a thousand rows that the application must then regroup. Two queries, one for parents and one for all children by parent identifier, transfers less and is usually faster. A data loader that collects identifiers within an event loop tick and issues one query per tick generalises this and removes the coupling between the access pattern and the shape of the code.</p>
<aside class="tip">Keyset pagination beats offset pagination at depth for exactly the same reason indexes work. <code>OFFSET 100000</code> requires the database to produce and discard a hundred thousand rows, while a predicate on the last seen sort key seeks directly into the index and reads only what it returns.</aside>`,
      Expert: `<p>Index selection is a physical design problem constrained by the access paths the storage engine offers, and the planner mediates between them with a cost model that is a simplification of reality. Working effectively at this level means knowing which parts of the model are approximations and how they fail.</p>
<h2>Where the cost model bends</h2>
<p>Costs are expressed in arbitrary units calibrated against page reads, with a fixed multiplier for random access. On storage where random and sequential access differ far less than the default assumes, the planner systematically undervalues index scans, and the calibration constant is the correct fix rather than hints or rewrites. Similarly, the cache hit assumption is a global constant that has no idea which of your tables are hot, so a small heavily cached table is costed as though every page must be fetched from disk.</p>
<h2>Details that change designs</h2>
<ul>
<li><strong>Index only scans still touch visibility information.</strong> A <strong>covering index</strong> delivers its promised win only when the visibility map is current, which depends on maintenance having run, so the benefit can disappear on a heavily updated table.</li>
<li><strong>Ordering within a composite index is not free to change later.</strong> Two indexes with the same columns in different orders serve different queries, and both may be justified, but the second doubles the write cost of every affected statement.</li>
<li><strong>Skip scan exists in some engines and not others.</strong> Where it does, the <strong>left prefix rule</strong> softens for low cardinality leading columns; where it does not, the rule is absolute, and portable schema advice must assume the stricter case.</li>
<li><strong>Plan instability is a production hazard.</strong> A parameter value on the edge of a histogram bucket can flip a plan from index scan to sequential scan between two executions of the same prepared statement, which presents as an intermittent outage with no code change to blame.</li>
</ul>
<h2>Designing the access path with the schema</h2>
<p>The durable approach is to enumerate the handful of queries that carry the application's load, write the index that serves each one including its sort order, and treat any query outside that set as a candidate for a different structure entirely: a materialised aggregate, a search index, or a denormalised read model refreshed asynchronously. This is the same discipline as capacity planning, and it produces a schema whose performance is explicable rather than emergent. The <strong>N+1 problem</strong> is then not merely a bug to fix but a symptom worth tracking, since its appearance means the access pattern has drifted away from the paths the schema was designed for.</p>
<aside class="tip">Instrument queries per request and alert on the count, not only on the duration. A page that quietly grows from four queries to four hundred stays under every latency threshold in staging and falls over the first time a customer has a large account, and the count is the only signal that moves before the failure.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Choose the plan a left prefix planner would choose",
        difficulty: "Hard",
        statement: `<p>A planner picks an access path by asking which index can serve the query's equality predicates, how many rows that leaves, and whether the index's ordering removes the sort. Implement that decision.</p>
<p>You receive:</p>
<ul>
<li><code>stats</code>: <code>{ rows, distinct }</code>, where <code>distinct</code> maps a column to its number of distinct values. A column missing from <code>distinct</code> counts as 1, meaning no selectivity at all.</li>
<li><code>indexes</code>: an array of column name arrays, each one a composite index in order.</li>
<li><code>query</code>: <code>{ equals, orderBy }</code>, where <code>equals</code> maps column names to values and <code>orderBy</code> is a column name or <code>null</code>.</li>
</ul>
<p>For each index, count its matched prefix: the longest run of columns from the start that all appear in <code>equals</code>. An index with a matched prefix of zero is unusable.</p>
<p>Among usable indexes choose the longest matched prefix, and on a tie the one listed first. Then return <code>{ index, rowsScanned, sorted }</code>:</p>
<ul>
<li><code>index</code> is the chosen column array, or <code>null</code> when nothing is usable.</li>
<li><code>rowsScanned</code> is <code>rows</code> divided by the product of the distinct counts of the matched prefix columns, rounded up, never below 1. With no usable index it is <code>rows</code>.</li>
<li><code>sorted</code> is <code>true</code> when <code>orderBy</code> is null, or when the index column immediately after the matched prefix is the <code>orderBy</code> column. With no usable index it is true only when <code>orderBy</code> is null.</li>
</ul>`,
        fn: "choosePlan",
        params: "stats, indexes, query",
        tests: [
          {
            args: [
              { rows: 100000, distinct: { tenantId: 500, status: 4, createdAt: 90000 } },
              [["tenantId", "status", "createdAt"], ["status"]],
              { equals: { tenantId: "t1", status: "open" }, orderBy: "createdAt" },
            ],
            expected: {
              index: ["tenantId", "status", "createdAt"],
              rowsScanned: 50,
              sorted: true,
            },
            label: "equality columns first, sort column last",
          },
          {
            args: [
              { rows: 5000, distinct: { email: 5000 } },
              [["tenantId", "status"]],
              { equals: { email: "someone@example.test" }, orderBy: null },
            ],
            expected: { index: null, rowsScanned: 5000, sorted: true },
            label: "no index leads with a filtered column",
          },
          {
            args: [
              { rows: 200, distinct: { tenantId: 10 } },
              [["tenantId"]],
              { equals: {}, orderBy: "createdAt" },
            ],
            expected: { index: null, rowsScanned: 200, sorted: false },
            label: "full scan still owes a sort",
          },
          {
            args: [
              { rows: 1000, distinct: { a: 10, b: 5, c: 2 } },
              [["b"], ["a", "b"]],
              { equals: { a: 1, b: 2 }, orderBy: null },
            ],
            expected: { index: ["a", "b"], rowsScanned: 20, sorted: true },
            label: "longest matched prefix wins",
          },
          {
            args: [
              { rows: 300, distinct: {} },
              [["region"]],
              { equals: { region: "eu" }, orderBy: null },
            ],
            expected: { index: ["region"], rowsScanned: 300, sorted: true },
            label: "unknown distinct count gives no selectivity",
          },
          {
            args: [
              { rows: 1000, distinct: { status: 5 } },
              [["status", "name"]],
              { equals: { status: "open" }, orderBy: "createdAt" },
            ],
            expected: { index: ["status", "name"], rowsScanned: 200, sorted: false },
            label: "index used but the sort survives",
            hidden: true,
          },
          {
            args: [
              { rows: 100, distinct: { a: 2, b: 50 } },
              [["a", "x"], ["b", "y"]],
              { equals: { a: 1, b: 2 }, orderBy: null },
            ],
            expected: { index: ["a", "x"], rowsScanned: 50, sorted: true },
            label: "equal prefixes keep the first index listed",
          },
        ],
        hints: [
          "The matched prefix stops at the first index column that is not an equality predicate, and never resumes, which is exactly what makes column order matter so much.",
          "Selectivity is the product of the distinct counts of the matched prefix columns only. Columns beyond the prefix contribute nothing, because the index cannot narrow on them.",
          "Compare candidates on prefix length rather than on estimated rows, and use a strictly greater comparison so the first index listed survives a tie.",
        ],
        solution: `function choosePlan(stats, indexes, query) {
  var equals = query.equals || {};
  var distinct = stats.distinct || {};
  var has = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  var best = null;

  for (var i = 0; i < indexes.length; i++) {
    var columns = indexes[i];
    var prefix = 0;
    while (prefix < columns.length && has(equals, columns[prefix])) prefix++;
    if (prefix === 0) continue;

    var selectivity = 1;
    for (var c = 0; c < prefix; c++) {
      var d = distinct[columns[c]];
      selectivity *= d && d > 0 ? d : 1;
    }

    var candidate = {
      index: columns,
      rowsScanned: Math.max(1, Math.ceil(stats.rows / selectivity)),
      sorted: !query.orderBy || columns[prefix] === query.orderBy,
      prefix: prefix
    };

    if (!best || candidate.prefix > best.prefix) best = candidate;
  }

  if (!best) {
    return { index: null, rowsScanned: stats.rows, sorted: !query.orderBy };
  }
  return { index: best.index, rowsScanned: best.rowsScanned, sorted: best.sorted };
}`,
        skills: ["Left prefix rule", "Selectivity", "Query plans"],
      },
    ],
  },

  5016: {
    topicId: 5016,
    title: "Authentication, sessions and JWTs",
    summary:
      "Prove who a user is and keep proving it on every request, choosing between server sessions and tokens on the grounds that actually matter: revocation, storage and blast radius.",
    concepts: [
      "Authentication versus authorisation",
      "Password storage",
      "Session cookies",
      "Token based auth",
      "Revocation",
      "Cross site request forgery",
    ],
    glossary: {
      Authentication: "Establishing who the caller is.",
      Authorisation: "Deciding what that caller is allowed to do, which is a separate question asked on every request.",
      "Password hashing":
        "Storing a slow, salted one way derivation of a password so a stolen database does not yield the passwords.",
      "Session cookie":
        "An opaque identifier stored in a cookie, with the real session state held on the server.",
      JWT: "A signed token carrying claims, which the server can verify without a lookup and therefore cannot easily withdraw.",
      "Refresh token":
        "A long lived credential used only to obtain new short lived access tokens, and the natural place to implement revocation.",
      SameSite:
        "A cookie attribute limiting when a cookie is sent on cross site requests, the primary structural defence against request forgery.",
      "httpOnly":
        "A cookie attribute that hides the value from JavaScript, so a script injection cannot read the session identifier.",
    },
    body: {
      Beginner: `<p>Two different questions get confused constantly. <strong>Authentication</strong> asks who are you. <strong>Authorisation</strong> asks are you allowed to do this. Logging in answers the first once. The second must be answered on every single request, because knowing who someone is tells you nothing about whether they may delete this particular invoice.</p>
<h2>Never store a password</h2>
<p>Store the result of a slow, one way function of the password with a random salt, using a purpose built algorithm such as argon2 or bcrypt. If the database is stolen, the attacker has hashes that take a very long time to attack rather than a list of passwords.</p>
<ul>
<li>Never store the password itself, in any form you can reverse.</li>
<li>Never use a fast general hash. Speed is the attacker's advantage here, which is why these algorithms are deliberately slow.</li>
<li>Never write your own scheme. This is the clearest example in the whole course of a solved problem.</li>
</ul>
<h2>Staying logged in</h2>
<p>HTTP does not remember anything between requests, so after logging in the server gives the browser something to send back each time. The traditional and still excellent answer is a cookie holding a random identifier, with the real information kept on the server.</p>
<pre>Set-Cookie: sid=8f2c...; HttpOnly; Secure; SameSite=Lax; Path=/</pre>
<p>Each of those flags is doing a job. <code>HttpOnly</code> means scripts cannot read it. <code>Secure</code> means it is never sent over plain http. <code>SameSite</code> limits when other sites can cause it to be sent.</p>
<aside class="tip">Because the browser attaches cookies automatically, another website can cause your browser to make a request to your bank while logged in. That is cross site request forgery, and the modern defence is the SameSite attribute plus a token on state changing requests.</aside>
<h2>Log out must mean something</h2>
<p>With a server session, logging out deletes the session and the identifier is instantly worthless. That property is more valuable than it sounds, and it is the main thing you give up when you move to self contained tokens.</p>`,
      Intermediate: `<p>The design question is not sessions versus tokens as a matter of taste. It is where the authority lives, and therefore how quickly you can withdraw access.</p>
<h2>Server sessions</h2>
<p>A <strong>session cookie</strong> carries an opaque random identifier while the state lives in your store. Revocation is a delete. Rotation on privilege change is trivial. The identifier reveals nothing if leaked in a log. The cost is a lookup per request, which is a fast key value read, and the fact that the store is shared state your servers all need.</p>
<h2>Self contained tokens</h2>
<p>A <strong>JWT</strong> carries its claims in the payload with a signature over them, so any service holding the key can verify it without a lookup. That is genuinely useful across service boundaries. The price is that a valid token remains valid until it expires, so revocation requires either a denylist, which reintroduces the lookup you were avoiding, or a short lifetime with a <strong>refresh token</strong> that can be revoked. The standard arrangement is an access token measured in minutes and a refresh token measured in days, stored in an httpOnly cookie and rotated on every use.</p>
<h2>Where to put the credential</h2>
<ul>
<li><strong>httpOnly cookie</strong>: unreadable by scripts, sent automatically, needs forgery protection. This is the right default for a browser client.</li>
<li><strong>Local storage</strong>: readable by any script on the page, which means a single injected script exfiltrates the token. It avoids forgery only by making theft easier.</li>
<li><strong>Memory</strong>: safest, lost on refresh, so it is paired with a refresh cookie to restore the session.</li>
</ul>
<h2>Forgery and the two defences</h2>
<p><strong>Cross site request forgery</strong> exploits the fact that cookies are attached automatically. <code>SameSite=Lax</code> stops the cookie being sent on cross site requests other than top level navigations, which removes the common case. For anything sensitive, add a token that must be echoed in a header, since a cross site attacker can cause a request but cannot read your page to obtain the token. Checking the Origin header on state changing requests is a cheap additional layer.</p>
<aside class="tip">Verify tokens strictly. Pin the accepted algorithm rather than trusting the header, and always check issuer, audience and expiry. A verifier that accepts whatever algorithm the token declares can be handed a token signed with none at all, which is the archetypal implementation failure in this area.</aside>`,
      Advanced: `<p>Assume the mechanisms. What separates a workable design from a fragile one is how it handles rotation, multi device sessions and the moment something is compromised.</p>
<h2>Lifecycle beyond login</h2>
<ul>
<li>Rotate the session identifier on any privilege change, especially at login, or an identifier planted by an attacker before authentication becomes an authenticated one afterwards.</li>
<li>Rotate <strong>refresh tokens</strong> on every use and treat the reuse of a consumed one as evidence of theft, which should invalidate the entire family and force reauthentication.</li>
<li>Give users a session list with device and location, and the ability to end one. This is a security control and a support tool at once.</li>
<li>Bind sessions loosely to context: a change of address family or user agent is worth a step up challenge, not an automatic termination, since mobile networks change addresses constantly.</li>
</ul>
<h2>Revocation is the design constraint</h2>
<p>Decide up front how long a compromised credential can remain useful and design backwards from that number. A five minute access token means five minutes of exposure without any lookup. A one hour token with a denylist means the lookup is back and you have the complexity of both designs. There is no arrangement that gives stateless verification and instant <strong>revocation</strong> simultaneously; the choice is which side of that trade you want, and it should be recorded as a decision rather than discovered during an incident.</p>
<h2>Adjacent controls that carry weight</h2>
<p>Rate limit authentication by account and by address, and prefer a delay over a hard lock so an attacker cannot use lockout as a denial of service. Make failures indistinguishable between an unknown account and a wrong password, including in timing. Check submitted passwords against a breached password list, which is more effective than any composition rule. Send an email on password and email changes, since notification is often what surfaces an account takeover. And treat password reset tokens with the same care as sessions: single use, short lived, and invalidating existing sessions when used.</p>
<aside class="tip">Multi factor authentication is the single largest improvement available, and the factor matters. Codes over SMS are vulnerable to number transfer attacks, application generated codes are far stronger, and hardware backed passkeys resist phishing outright because the credential is bound to the origin.</aside>`,
      Expert: `<p>Authentication is the process of establishing an authenticated identity, and everything after it is the maintenance of a bearer credential. Framing it that way makes the risks explicit: whoever holds the credential is the user, so the entire design reduces to limiting who can obtain it, how long it is useful and how quickly it can be destroyed.</p>
<h2>The properties worth stating explicitly</h2>
<p>A credential design should be able to answer four questions with numbers: what is the maximum window between compromise and loss of usefulness, what is the blast radius of a single stolen credential, what is the cost of verification per request, and what happens when the signing key must be replaced. Session identifiers answer the first with zero and the third with a lookup. Signed tokens answer the first with the token lifetime and the third with a signature check. Key rotation is the question most often left unanswered, and the workable arrangement is a key identifier in the header with a published key set and an overlap period, so verifiers accept both keys while tokens signed with the old one drain away.</p>
<h2>Where implementations go wrong</h2>
<ul>
<li><strong>Algorithm confusion.</strong> A verifier that reads the algorithm from the token can be persuaded to treat a public key as an HMAC secret. Pin the algorithm and the key type.</li>
<li><strong>Claims that are not checked.</strong> Expiry, issuer and audience are frequently ignored, which turns a token minted for one service into a valid credential at another.</li>
<li><strong>Authorisation data frozen into a token.</strong> Roles embedded in a long lived token mean a revoked permission persists until expiry, which is a slower and less visible failure than a stale session.</li>
<li><strong>Logout that only clears the client.</strong> Deleting a cookie in the browser does nothing to a token that remains valid, so any client copy or intercepted value still works.</li>
<li><strong>Timing and enumeration leaks.</strong> Registration, reset and login flows that reveal whether an account exists provide the target list for every later attack.</li>
</ul>
<h2>The shape that holds up</h2>
<p>For a browser first application, the arrangement that survives review is an opaque session in an httpOnly, Secure, SameSite cookie with server side state, forgery protection on state changing requests, and passkeys or application generated second factors. Where services must verify independently, mint short lived signed tokens from that session at the boundary, so the internal system gets stateless verification while the user facing credential keeps instant <strong>revocation</strong>. This composition is more code than either approach alone, and it is the only one that gives both properties where each is needed.</p>
<aside class="tip">Log authentication events as a first class stream: successes, failures, refreshes, revocations and step ups, with a stable subject identifier and never any credential material. Almost every account takeover is discovered from this stream rather than from the application, and it cannot be reconstructed after the fact if it was not being written.</aside>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Which statement correctly separates authentication from authorisation?",
        options: [
          "Authentication runs once at login; authorisation is checked on every request",
          "Authentication is for users and authorisation is for services",
          "Authorisation happens first, then authentication confirms it",
          "They are the same check expressed at different layers",
        ],
        answer: 0,
        explanation:
          "Establishing identity happens at login and is then carried by a credential, while permission to perform a specific action depends on the action and must be evaluated each time. Treating them as one check is exactly how an endpoint ends up trusting any logged in user with another tenant's records.",
        difficulty: "Easy",
        skill: "Authentication versus authorisation",
      },
      {
        n: 2,
        question:
          "Why is a fast general purpose hash the wrong choice for storing passwords?",
        options: [
          "It produces collisions too often",
          "Speed helps the attacker, since offline guessing scales with how many hashes per second they can compute",
          "It cannot be salted",
          "Its output is too short to store safely",
        ],
        answer: 1,
        explanation:
          "Password storage wants deliberate slowness and memory cost, because the threat model is offline brute force against a stolen table. Worrying about collisions is the tempting cryptographic instinct, but collisions are irrelevant here: the attacker guesses candidate passwords rather than trying to construct one.",
        difficulty: "Easy",
        skill: "Password storage",
      },
      {
        n: 3,
        question:
          "What does the httpOnly flag on a session cookie prevent?",
        options: [
          "The cookie being sent over plain http",
          "The cookie being read by JavaScript running on the page",
          "The cookie being sent on cross site requests",
          "The cookie being stored on disk",
        ],
        answer: 1,
        explanation:
          "httpOnly hides the value from script, so an injected script cannot read and exfiltrate the session identifier. Preventing plain http transmission is the Secure flag and limiting cross site sending is SameSite, which is why all three are usually set together.",
        difficulty: "Medium",
        skill: "Session cookies",
      },
      {
        n: 4,
        question:
          "A user's account is compromised and you revoke it. Why does a self contained token complicate this?",
        options: [
          "Tokens cannot carry an expiry time",
          "The token verifies from its signature alone, so it stays valid until it expires unless a lookup is reintroduced",
          "Tokens are stored on the server and must be searched for",
          "Revoking a token invalidates every other user's token",
        ],
        answer: 1,
        explanation:
          "Statelessness is the whole benefit and the whole cost: verification needs no shared state, so nothing central can withdraw the token before expiry without adding a denylist. Thinking tokens live on the server confuses them with session identifiers, where revocation is simply a delete.",
        difficulty: "Medium",
        skill: "Revocation",
      },
      {
        n: 5,
        question:
          "Why is storing an access token in local storage a poor default for a browser application?",
        options: [
          "Local storage has a small size limit",
          "Any script running on the page can read it, so one injection exfiltrates the credential",
          "Local storage is cleared on every navigation",
          "Tokens in local storage cannot be sent in headers",
        ],
        answer: 1,
        explanation:
          "Local storage is fully readable by page scripts, which converts any script injection directly into credential theft, whereas an httpOnly cookie stays invisible to script. Choosing it to dodge request forgery is the common reasoning, and it trades a well solved problem for a much worse one.",
        difficulty: "Medium",
        skill: "Token based auth",
      },
      {
        n: 6,
        question:
          "Why must a session identifier be rotated at the moment of login?",
        options: [
          "To prevent the identifier being guessed by brute force",
          "So an identifier planted before authentication cannot become an authenticated session",
          "To reset the cookie expiry",
          "Because the identifier length must change for logged in users",
        ],
        answer: 1,
        explanation:
          "If the pre login identifier survives authentication, an attacker who fixed that value in the victim's browser now holds a fully authenticated session. Framing it as brute force protection misreads the attack: the identifier is not guessed, it is supplied by the attacker in advance.",
        difficulty: "Hard",
        skill: "Session cookies",
      },
      {
        n: 7,
        question:
          "A token verifier reads the algorithm from the token header and verifies accordingly. What is the risk?",
        options: [
          "Verification becomes slower for large tokens",
          "An attacker can choose an algorithm the verifier handles unsafely, for example presenting a public key as an HMAC secret",
          "The token cannot be decoded by clients",
          "The signature will not match across services",
        ],
        answer: 1,
        explanation:
          "Letting the token choose the verification method hands the attacker control of the key interpretation, which is the classic algorithm confusion failure, so the accepted algorithm must be pinned by configuration. Performance is not the issue: the cost difference between algorithms is irrelevant next to accepting an attacker chosen one.",
        difficulty: "Hard",
        skill: "Token based auth",
      },
      {
        n: 8,
        question:
          "Which pair of measures addresses cross site request forgery most directly?",
        options: [
          "Hashing the session identifier and rotating it hourly",
          "SameSite on the cookie plus a token echoed in a header on state changing requests",
          "Storing the session in local storage and sending it manually",
          "Using HTTPS and a long random identifier",
        ],
        answer: 1,
        explanation:
          "SameSite stops the browser attaching the cookie to most cross site requests, and a header token cannot be produced by an attacker who can trigger a request but cannot read the page. Transport security and identifier length protect against interception and guessing, neither of which is what forgery relies on.",
        difficulty: "Hard",
        skill: "Cross site request forgery",
      },
    ],
  },

  5017: {
    topicId: 5017,
    title: "Testing: unit, integration and what to skip",
    summary:
      "Decide what deserves a test, at which level, and write assertions that fail with a message telling you what went wrong rather than merely that something did.",
    concepts: [
      "Test levels and their trade offs",
      "Test doubles",
      "Behaviour versus implementation",
      "Deterministic tests",
      "Assertion quality",
      "Coverage as a signal",
    ],
    glossary: {
      "Unit test":
        "A fast test of one module in isolation, giving precise failure location and no confidence about integration.",
      "Integration test":
        "A test exercising several real components together, typically including the database, which is where most real defects appear.",
      "End to end test":
        "A test driving the real interface against a running system, expensive and slow but the only one that proves the whole path.",
      Stub: "A double returning canned answers so the test can reach the code it cares about.",
      Mock: "A double that also asserts how it was called, which couples the test to the implementation.",
      Flake: "A test that passes and fails without any change to the code, usually through time, ordering or shared state.",
      "Test double":
        "Any stand in for a real dependency, including stubs, mocks, fakes and spies.",
    },
    body: {
      Beginner: `<p>A test is a small program that runs your code and complains when the answer is wrong. Its value is not that it passes today but that it fails on the day somebody breaks something, including you in six months.</p>
<h2>The three levels</h2>
<ul>
<li><strong>Unit</strong>: one function or module on its own. Milliseconds to run, and it tells you exactly which line is wrong.</li>
<li><strong>Integration</strong>: several real pieces together, usually including a real database. Slower, and it catches the mistakes that only appear where two pieces meet.</li>
<li><strong>End to end</strong>: a real browser driving the real application. Slowest by far, and the only kind that proves a user can actually complete a task.</li>
</ul>
<p>You want many of the first, a solid layer of the second, and a small number of the third covering the journeys that must never break, such as signing in and paying.</p>
<h2>Test what it does, not how</h2>
<pre>// brittle: breaks when you rename an internal helper
expect(calculateSubtotal).toHaveBeenCalled();

// durable: still true after any refactor
expect(totalFor(basket)).toBe(1250);</pre>
<p>The first test fails when you tidy the code, which trains people to ignore failures. The second fails only when the answer is wrong.</p>
<aside class="tip">A test that uses the current date, a random value or the order of another test will eventually fail for no reason. Inject the clock, seed the randomness, and give every test its own data. A test suite nobody trusts is worse than no suite, because it costs time and provides no signal.</aside>
<h2>What to skip</h2>
<p>Do not test the framework, or a getter that only returns a field, or a snapshot of a whole page that has to be regenerated every time anyone changes a class name. Spend the effort on logic with branches, on anything involving money or permissions, and on every bug you have already had.</p>`,
      Intermediate: `<p>Testing is an investment with a maintenance cost, so the question for each test is whether it will catch a real defect more often than it will demand attention for no reason.</p>
<h2>Choosing a level</h2>
<p>Push each test to the lowest level that can actually catch its target defect. A branch in a pricing rule belongs in a <strong>unit test</strong>, because at that level you can enumerate cases cheaply. A defect in a query, a transaction boundary or a serialisation belongs in an <strong>integration test</strong>, because a unit test with a mocked repository asserts only that your mock behaves like your assumptions. A defect in the composition of the whole path belongs in an <strong>end to end test</strong>, and there should be few of them because their cost per test is a hundred times higher.</p>
<h2>Doubles, and the cost of each</h2>
<ul>
<li>A <strong>stub</strong> returns canned data and couples you only to the shape of the dependency.</li>
<li>A fake is a working simplified implementation, such as an in memory repository, and is usually the best value double because tests read naturally against it.</li>
<li>A <strong>mock</strong> asserts on the calls made, which encodes the implementation into the test and makes refactoring expensive.</li>
<li>Faking the thing you are actually trying to verify, most often the database, removes the test's entire reason for existing.</li>
</ul>
<h2>Assertions should explain</h2>
<p>The message a failing test prints is what determines how long the fix takes. Asserting on a whole object with a structural comparison gives you the exact path that differs. Asserting a boolean gives you nothing but the word false. This is why a comparison helper that reports which field mismatched, at which path, is worth more than any number of individual assertions.</p>
<h2>Determinism is not optional</h2>
<p>A <strong>flake</strong> destroys the value of the whole suite, because once failures are sometimes meaningless people stop reading them. The usual causes are a small list: real time and time zones, unseeded randomness, shared state between tests, dependence on execution order, and waiting for a fixed duration rather than for a condition. Each has a standard remedy, and quarantining a flaky test with a ticket is far better than leaving it to erode trust.</p>
<aside class="tip">Coverage is a signal, not a target. A line covered by a test with no meaningful assertion is not tested, and a codebase at ninety percent can miss every branch that matters. Use it to find untested areas, never as the acceptance criterion for a change.</aside>`,
      Advanced: `<p>Assume levels and doubles. The remaining questions are about designing for testability, controlling the cost of the slow layers, and testing things that are awkward by nature.</p>
<h2>Testability is a design property</h2>
<p>Code is hard to test when it hides its dependencies, mixes decisions with input and output, or reaches for global state. The remedies are architectural rather than test specific: pass the clock, the identifier generator and the network client in rather than importing them; keep pure decision logic separate from the shell that performs the effects; and let the effectful shell be thin enough that an integration test covers it. When a test needs six mocks, the message is about the design of the unit, not about the test.</p>
<h2>Making integration tests affordable</h2>
<ul>
<li>Run against a real database in a container. A different engine in tests is a source of confident wrong answers.</li>
<li>Wrap each test in a transaction and roll back, or truncate between tests. Shared mutable fixtures are the most common cause of order dependence.</li>
<li>Build data with factories that take overrides, so each test states only what it cares about and the rest is plausible defaults.</li>
<li>Parallelise by schema or by database rather than serialising, since suite duration is what determines whether people run it before pushing.</li>
</ul>
<h2>Techniques for the awkward cases</h2>
<p>Property based testing generates inputs and checks invariants, which finds edge cases nobody enumerates, and its shrinking of a failing case to a minimal example is often the fastest route to a diagnosis. Contract tests verify that a consumer's expectations and a provider's behaviour agree, which is what a mocked integration cannot do. Snapshot tests are appropriate for output whose exact form matters and changes rarely, and inappropriate for anything a person edits weekly, since an approval workflow with no reading is not a test. For asynchronous code, wait for a condition with a timeout rather than sleeping, and control time explicitly with a fake clock so a scheduled behaviour can be verified in milliseconds.</p>
<aside class="tip">Every bug that reaches production deserves a test written before the fix, at the lowest level that reproduces it. This is the only mechanism that reliably grows a suite towards the shape of your actual defects rather than towards whatever was easy to test.</aside>`,
      Expert: `<p>A test suite is an executable specification with a maintenance budget, and its value is the product of how often it catches a real defect and how quickly it localises one, minus the cost of the failures it produces for no reason. Every decision in testing is an attempt to improve one of those three terms.</p>
<h2>Where coupling actually comes from</h2>
<p>Tests that fail during refactoring are coupled to structure rather than to behaviour, and the coupling has identifiable sources: assertions on call sequences, doubles for collaborators that are implementation details, and access to internals the production caller could not reach. The discipline that removes it is to define the unit by its interface rather than by its file, so a module and its private helpers are tested as one thing through the boundary the rest of the system uses. Suites built this way survive large internal changes, which is precisely the situation in which a suite is most valuable and most often discarded instead.</p>
<h2>Points the usual guidance skips</h2>
<ul>
<li><strong>Mutation testing measures what coverage claims to.</strong> Introducing small changes and checking that a test fails distinguishes an asserted line from an executed one, and it routinely shows a high coverage suite catching a fraction of the mutants.</li>
<li><strong>Flaky tests are usually real bugs.</strong> Ordering, timing and shared state defects in tests reflect concurrency assumptions in the code, and deleting the test hides a genuine race more often than it removes a nuisance.</li>
<li><strong>Feedback time changes behaviour.</strong> Beyond roughly ten minutes, the suite stops being run before pushing, at which point its defect detection moves to continuous integration and its cost per failure rises sharply.</li>
<li><strong>End to end tests are a monitoring technique as much as a testing one.</strong> The same journeys run continuously against production are worth more than an equivalent number run once per merge.</li>
</ul>
<h2>Deciding what not to test</h2>
<p>Skipping is a design decision that should be made explicitly and written down. Configuration wiring, framework behaviour, trivial delegation and presentational detail are usually better left to type checking, review and a small number of visual checks. What must never be skipped is anything where a defect is silent and expensive: money, permissions, data retention, and every path that writes to a system you cannot roll back. A suite that reflects that ordering is smaller, faster and considerably more useful than one aiming at a coverage number, and it is the only version of the practice that survives a deadline.</p>
<aside class="tip">Write the assertion failure message you want to read at three in the morning, then work backwards to the assertion that produces it. Naming the expected and actual values, the path at which they differ, and the input that produced them turns a failing build from an investigation into a reading exercise.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Report exactly where two values differ",
        difficulty: "Hard",
        statement: `<p>The quality of a test suite is largely the quality of its failure messages. Implement the comparison an assertion library performs so that a failure names the path that differs rather than merely reporting false.</p>
<p>Return an array of message strings describing every difference between <code>actual</code> and <code>expected</code>, in traversal order.</p>
<ul>
<li>Build paths by joining object keys with a dot and appending array indexes in brackets, for example <code>user.roles[1]</code>. At the top level, where there is no path, use <code>(root)</code>.</li>
<li>When both sides are plain objects, walk the expected keys in order. A key missing from <code>actual</code> reports <code>"PATH: missing"</code>. Then, in the order they appear in <code>actual</code>, report any key not present in <code>expected</code> as <code>"PATH: unexpected"</code>.</li>
<li>When both sides are arrays of different lengths, report <code>"PATH: expected length N but got M"</code>, then compare the indexes both arrays have.</li>
<li>In every other case, compare the JSON encoding of the two values, and on a difference report <code>"PATH: expected E but got A"</code> using those encodings, so strings appear in quotes.</li>
</ul>
<p>Return an empty array when the two values match.</p>`,
        fn: "diff",
        params: "actual, expected",
        tests: [
          {
            args: [
              { user: { name: "Ada", roles: ["admin"] } },
              { user: { name: "Ada", roles: ["admin"] } },
            ],
            expected: [],
            label: "identical structures",
          },
          {
            args: [{ user: { name: "Ada", age: 36 } }, { user: { name: "Ada", age: 35 } }],
            expected: ["user.age: expected 35 but got 36"],
            label: "one nested value differs",
          },
          {
            args: [
              { name: "Ada", nickname: "A" },
              { name: "Ada", email: "ada@example.test" },
            ],
            expected: ["email: missing", "nickname: unexpected"],
            label: "missing and unexpected keys",
          },
          {
            args: [{ roles: ["admin", "editor"] }, { roles: ["admin", "owner", "viewer"] }],
            expected: [
              "roles: expected length 3 but got 2",
              'roles[1]: expected "owner" but got "editor"',
            ],
            label: "array length and element mismatch",
          },
          {
            args: [2, 1],
            expected: ["(root): expected 1 but got 2"],
            label: "primitive at the root",
          },
          {
            args: [{ tags: {} }, { tags: [] }],
            expected: ["tags: expected [] but got {}"],
            label: "an array is not an object",
          },
          {
            args: [{ items: [{ id: 1, qty: 2 }] }, { items: [{ id: 1, qty: 3 }] }],
            expected: ["items[0].qty: expected 3 but got 2"],
            label: "objects nested inside arrays",
            hidden: true,
          },
        ],
        hints: [
          "One recursive walk carrying the current path handles every case. Decide the branch by looking at both sides: two arrays, two plain objects, or anything else.",
          "Arrays and null both report as object under typeof, so test for them explicitly before deciding that a value is a plain object.",
          "Report missing expected keys during the first pass over the expected keys, then make a second pass over the actual keys for the unexpected ones, which is what gives the message order in the tests.",
        ],
        solution: `function diff(actual, expected) {
  var messages = [];

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  function label(path) {
    return path === "" ? "(root)" : path;
  }
  function show(value) {
    return JSON.stringify(value);
  }
  function child(path, key) {
    return path === "" ? key : path + "." + key;
  }

  function walk(a, e, path) {
    if (Array.isArray(a) && Array.isArray(e)) {
      if (a.length !== e.length) {
        messages.push(label(path) + ": expected length " + e.length + " but got " + a.length);
      }
      var shared = Math.min(a.length, e.length);
      for (var i = 0; i < shared; i++) walk(a[i], e[i], path + "[" + i + "]");
      return;
    }

    if (isPlainObject(a) && isPlainObject(e)) {
      var expectedKeys = Object.keys(e);
      for (var k = 0; k < expectedKeys.length; k++) {
        var key = expectedKeys[k];
        if (!Object.prototype.hasOwnProperty.call(a, key)) {
          messages.push(child(path, key) + ": missing");
          continue;
        }
        walk(a[key], e[key], child(path, key));
      }
      var actualKeys = Object.keys(a);
      for (var j = 0; j < actualKeys.length; j++) {
        var extra = actualKeys[j];
        if (!Object.prototype.hasOwnProperty.call(e, extra)) {
          messages.push(child(path, extra) + ": unexpected");
        }
      }
      return;
    }

    if (show(a) !== show(e)) {
      messages.push(label(path) + ": expected " + show(e) + " but got " + show(a));
    }
  }

  walk(actual, expected, "");
  return messages;
}`,
        skills: ["Assertion quality", "Behaviour versus implementation", "Deterministic tests"],
      },
    ],
  },

  5018: {
    topicId: 5018,
    title: "CI/CD and environment configuration",
    summary:
      "Build a pipeline that makes shipping boring: one artefact promoted through environments, configuration supplied from outside the build, and a deployment strategy with a way back.",
    concepts: [
      "Build once, promote many",
      "Configuration as environment",
      "Secret handling",
      "Pipeline stages and gates",
      "Deployment strategies",
      "Database migrations in a pipeline",
    ],
    glossary: {
      Artefact:
        "The immutable build output that is promoted unchanged from one environment to the next.",
      "Twelve factor configuration":
        "The practice of supplying environment specific values from outside the artefact rather than baking them in.",
      "Blue green deployment":
        "Running two production environments and switching traffic between them, so rollback is a switch back.",
      "Canary release":
        "Sending a small share of traffic to a new version first and watching its metrics before proceeding.",
      "Expand and contract":
        "A migration pattern that adds the new shape, moves traffic, then removes the old shape in a later release.",
      "Feature flag":
        "A runtime switch that separates deploying code from releasing behaviour.",
      "Pipeline gate":
        "An automated condition, such as a passing test suite or a security scan, that a change must satisfy before progressing.",
    },
    body: {
      Beginner: `<p>Continuous integration means everyone's work is merged and checked often, several times a day rather than in a large batch at the end. Continuous delivery means the checked result can be released at any time, with a single decision rather than a project.</p>
<h2>What the pipeline does</h2>
<p>Every push runs the same sequence, automatically, on a clean machine:</p>
<ul>
<li>Install dependencies from a lock file, so the versions are exactly the ones that were tested.</li>
<li>Check the code: types, linting, formatting.</li>
<li>Run the tests.</li>
<li>Build the artefact.</li>
<li>Deploy it, either automatically or when someone approves.</li>
</ul>
<p>The clean machine matters. A build that works only on your laptop depends on something you installed and forgot, and the pipeline is what discovers that.</p>
<h2>Build once</h2>
<p>The same built output should go to staging and then to production without being rebuilt. If you rebuild for production you have tested one thing and shipped another, and the difference between them is exactly where the surprise lives.</p>
<h2>Configuration comes from outside</h2>
<p>The database address, the API keys and the feature switches differ per environment, so they must not be inside the build. They are supplied as environment variables when the application starts.</p>
<pre>DATABASE_URL=postgres://...
SESSION_SECRET=...
LOG_LEVEL=info</pre>
<aside class="tip">Never commit a secret, not even briefly. Once it is in the history it is in every clone forever, and deleting the file does not remove it. If it happens, rotate the credential immediately, because that is the only action that actually helps.</aside>
<h2>A way back</h2>
<p>Every release needs a plan for undoing it that you have actually tried. Keeping the previous version available and being able to switch back within a minute is worth more than any amount of pre release checking, because it turns an incident into an inconvenience.</p>`,
      Intermediate: `<p>A pipeline is a machine for reducing the risk of change. Its design should make the safe path the easy one, and it should give the same answer for everybody who pushes.</p>
<h2>Stages and gates</h2>
<p>Order the <strong>pipeline gates</strong> so that the cheapest and most likely to fail run first: formatting and type checking in seconds, unit tests in a minute, integration tests in a few minutes, and end to end tests last against a deployed preview. Parallelise what is independent, cache dependencies by lock file hash, and keep the whole thing under about ten minutes, because beyond that people begin batching pushes and the feedback loop you were building disappears.</p>
<h2>One artefact, promoted</h2>
<p><strong>Build once, promote many</strong> is the rule that makes environments comparable. The artefact is built from a commit, tagged with it, and the same digest is deployed to staging and later to production. Any variation between environments therefore lives entirely in configuration, which is inspectable, rather than in the build, which is not.</p>
<h2>Configuration and secrets</h2>
<ul>
<li>Read configuration at start up, validate it against a schema, and refuse to boot on anything missing or malformed. A service that starts with a blank secret and fails later is much harder to diagnose.</li>
<li>Keep a documented example file listing every variable with a safe placeholder value, since undocumented configuration is discovered during incidents.</li>
<li>Store <strong>secrets</strong> in a manager, injected at runtime, never in the image and never in the repository. Rotate on a schedule so rotation is a routine rather than an emergency procedure.</li>
<li>Distinguish build time from run time values. Anything compiled into a client bundle is public no matter what you called the variable.</li>
</ul>
<h2>Deployment strategies</h2>
<p>Rolling replacement is the default and requires that two versions can run at once. <strong>Blue green</strong> keeps a full second environment and switches traffic, which makes rollback a switch back rather than a redeployment. A <strong>canary release</strong> sends a small share of traffic to the new version and watches error rates and latency before continuing, which catches the failures that only appear under real traffic. All three depend on health checks that mean something: a check that returns success as soon as the process starts will happily route traffic to an instance that cannot reach its database.</p>
<aside class="tip">Separate deployment from release with <strong>feature flags</strong>. Shipping code that is switched off lets you deploy small changes continuously and turn a feature on for a few accounts first, which is a far safer sequence than accumulating a large release branch and enabling everything at once.</aside>`,
      Advanced: `<p>Assume the pipeline. The difficult part is schema change, because the database is the one component that cannot be rolled back by switching an artefact.</p>
<h2>Migrations must be compatible in both directions</h2>
<p>During any rolling deployment, old and new code run simultaneously against one schema, so every migration must be safe for both. <strong>Expand and contract</strong> is the pattern that makes this reliable: add the new column as nullable, deploy code that writes both old and new, backfill in batches, deploy code that reads the new one, and only in a later release drop the old column. Each step is individually reversible, which is precisely the property a single destructive migration lacks.</p>
<ul>
<li>Adding a not null column with a default rewrites the table on older engines and locks it for the duration.</li>
<li>Adding an index without the concurrent option holds a write lock on the table until it completes.</li>
<li>Renaming anything is a break in disguise, and is best expressed as add, dual write, migrate readers, remove.</li>
<li>Set a short lock timeout on migrations so a blocked statement fails fast instead of queueing every other query behind it.</li>
</ul>
<h2>Pipeline integrity</h2>
<p>The pipeline is production infrastructure with credentials to your environments, and it must be treated as such. Pin actions and images by digest rather than by moving tag, restrict which branches can access deployment secrets, require review for changes to the pipeline itself, and prefer short lived identity federation over long lived static keys. Reproducibility matters here too: a build that depends on a floating dependency version cannot be rebuilt identically, which undermines both incident forensics and the promotion model.</p>
<h2>Preview environments</h2>
<p>Deploying every pull request to its own address changes review from reading a diff to using the change, and it is the highest leverage addition to a pipeline after the tests themselves. The costs are real and manageable: seeding data, isolating third party integrations behind sandbox credentials, and expiring the environment automatically when the branch is merged or abandoned.</p>
<aside class="tip">Roll back by promoting the previous artefact rather than by reverting a commit and rebuilding. The old artefact is already tested and already built, and during an incident the difference between a switch and a build is the difference between two minutes and twenty.</aside>`,
      Expert: `<p>A delivery pipeline is a supply chain, and the properties worth engineering are the supply chain properties: provenance, reproducibility, isolation of privilege and a bounded, rehearsed recovery path. Speed matters only because it changes behaviour, by making small changes cheaper than large ones.</p>
<h2>Provenance and reproducibility</h2>
<p>An <strong>artefact</strong> is trustworthy when you can say which source commit produced it, on which builder, from which dependency versions, and can verify that with a signature. This is what makes an incident answerable: given a digest running in production, you can recover the exact tree it came from. Reproducibility is the weaker but still valuable property that rebuilding the same inputs yields the same output, which requires pinned toolchains, lock files committed and honoured, and the removal of timestamps and absolute paths from the output. Most codebases fail this quietly, and discover it when they need to rebuild a version from eight months ago.</p>
<h2>Points that are usually learned expensively</h2>
<ul>
<li><strong>Environment parity is about behaviour, not naming.</strong> A staging environment with a tenth of the data and no concurrency does not exercise the plans, timeouts or lock contention that production has, so passing there is weak evidence.</li>
<li><strong>Health checks need two kinds.</strong> Liveness answers whether the process should be restarted; readiness answers whether it should receive traffic. Conflating them produces either restart loops or traffic sent to instances that cannot serve it.</li>
<li><strong>Rollback is not universal.</strong> Once a migration has contracted, or an outbound message has been sent, going back is a forward fix. Knowing which of your changes are irreversible, and treating those releases differently, is more useful than a general rollback policy.</li>
<li><strong>Flags accumulate.</strong> Every <strong>feature flag</strong> is a branch in production and a combination that nobody tests. Removing a flag should be part of the same piece of work that introduced it, with an expiry that is enforced.</li>
</ul>
<h2>The measure of a delivery system</h2>
<p>Four numbers describe it honestly: how often you deploy, how long a change takes from merge to production, what share of deployments cause a problem, and how long recovery takes. They interact in one direction. Smaller, more frequent changes reduce the size of each failure and the time to identify it, which lowers the last two figures rather than raising them. A team that deploys rarely because deployment is risky has built a system in which each deployment carries more change, which is what makes it risky. Breaking that loop is the actual goal of everything in this topic.</p>
<aside class="tip">Rehearse recovery on a schedule. A rollback that has never been performed, a restore from backup that has never been tested, and a runbook nobody has followed are all assumptions rather than capabilities, and an incident is the most expensive place to discover which one you have.</aside>`,
    },
  },

  5019: {
    topicId: 5019,
    title: "Observability: logs, traces and alerts",
    summary:
      "Instrument a system so that you can answer questions you did not anticipate, and alert on the small number of conditions a human should genuinely wake up for.",
    concepts: [
      "Structured logging",
      "Metrics and cardinality",
      "Distributed tracing",
      "Correlation identifiers",
      "Service level objectives",
      "Alert design",
    ],
    glossary: {
      "Structured log":
        "A log line emitted as key value data rather than prose, so it can be filtered and aggregated rather than only read.",
      Cardinality:
        "The number of distinct values a label can take, which drives the cost of a metrics system and is the usual cause of an outage in one.",
      Span: "One timed operation within a trace, carrying attributes and a parent, so a request becomes a tree.",
      "Trace identifier":
        "The value propagated across service boundaries that links every span of one request together.",
      "Service level objective":
        "A target for a user visible measure, such as the share of requests served successfully within a latency budget.",
      "Error budget":
        "The permitted shortfall from an objective over a window, which turns reliability into a quantity that can be spent.",
      "Percentile latency":
        "A latency figure at a given rank, such as the ninety ninth, which describes the tail that averages conceal.",
    },
    body: {
      Beginner: `<p>Monitoring tells you that something is wrong. Observability is being able to work out why, including for problems nobody anticipated. The difference matters at three in the morning.</p>
<h2>Three kinds of signal</h2>
<ul>
<li><strong>Logs</strong> record events. Good for detail about one specific thing that happened.</li>
<li><strong>Metrics</strong> record numbers over time. Good for trends, rates and dashboards.</li>
<li><strong>Traces</strong> record the path of one request through the system. Good for finding which step was slow.</li>
</ul>
<h2>Log data, not sentences</h2>
<p>A log line written as prose can only be read. A line written as data can be filtered, counted and grouped.</p>
<pre>// hard to work with
"User 42 failed to check out after 3 attempts"

// useful
{ "event": "checkout_failed", "userId": 42, "attempts": 3,
  "requestId": "b71c", "reason": "card_declined" }</pre>
<p>Now you can ask how many checkouts failed for that reason today, which the sentence version cannot answer without a fragile text search.</p>
<h2>One identifier that ties it together</h2>
<p>Give every incoming request an identifier, attach it to every log line and every downstream call, and return it to the client. When a user reports a problem and gives you that identifier, you can retrieve everything that happened for their request in one query. This is the cheapest and most valuable thing on this page.</p>
<aside class="tip">Never log passwords, tokens, card numbers or personal data. Logs are copied, shipped to other systems and kept for months, so anything sensitive in them has been spread widely. Redact at the point of writing, not later.</aside>
<h2>Alert on what users feel</h2>
<p>An alert should mean a person must act now. Paging on high processor usage produces alerts for a healthy system, and people learn to ignore them. Paging because checkouts are failing produces alerts that always matter.</p>`,
      Intermediate: `<p>Observability is the ability to answer new questions about a running system without shipping new code to answer them. That framing decides how you instrument: capture enough context on each event that unanticipated queries are possible.</p>
<h2>Structured logs with context</h2>
<p>Emit <strong>structured logs</strong> as objects, with a stable event name and a consistent set of fields. Carry request scoped context automatically so every line inside a request includes the request identifier, the user or tenant, the route and the version, rather than relying on each call site to remember. Levels should mean something specific: error for something a human must eventually look at, warn for a handled degradation, info for state changes worth an audit, debug for detail that is off in production.</p>
<h2>Metrics and the cardinality trap</h2>
<p>Metrics are cheap because they aggregate, and that property disappears the moment a label has unbounded values. A counter labelled with a user identifier, a path containing identifiers or a full URL creates a separate time series per value, and <strong>cardinality</strong> explosion is a common way to take down a metrics backend. Label with the route template rather than the path, with the status class rather than the status, and put the high cardinality detail in logs and traces where it belongs.</p>
<h2>Tracing across boundaries</h2>
<p>A trace is a tree of <strong>spans</strong>, each a timed operation with attributes and a parent. Its value comes entirely from propagation: the <strong>trace identifier</strong> must be passed through every HTTP call, queue message and background job, or the tree breaks into disconnected fragments. With propagation working, a slow request becomes readable at a glance, and the N+1 pattern from an earlier topic appears as a comb of hundreds of tiny identical spans, which is the fastest way to identify it.</p>
<h2>Objectives before alerts</h2>
<p>Define a <strong>service level objective</strong> as a target on something a user experiences, such as the share of requests completing successfully within a latency budget over a rolling window. That gives you an <strong>error budget</strong>, the permitted shortfall, and turns reliability into a quantity you can spend deliberately. Alerts then derive from the budget rather than from arbitrary thresholds, which is what stops a dashboard of numbers becoming a wall of pages.</p>
<aside class="tip">Report <strong>percentile latency</strong>, never the mean. An average hides the tail entirely, and the tail is what users notice: a service can average eighty milliseconds while one request in fifty takes four seconds, and only the second figure explains the complaints.</aside>`,
      Advanced: `<p>Assume the three signals. The harder problems are sampling, alert quality and making the data usable during an incident rather than after it.</p>
<h2>Sampling without losing the interesting requests</h2>
<p>Tracing everything is expensive and mostly redundant, since the vast majority of requests are unremarkable. Head based sampling decides at the start and is cheap but blind, so it discards the slow and failing requests at the same rate as the rest. Tail based sampling buffers spans and decides once the outcome is known, keeping every error and every slow request plus a small share of the ordinary ones, at the cost of holding spans in memory and requiring all spans of a trace to reach the same collector. Whichever is used, the sampling decision must be propagated so a trace is not half kept.</p>
<h2>Designing alerts people trust</h2>
<ul>
<li>Page only on symptoms a user experiences. Route causes such as processor saturation belong on dashboards, not on a pager.</li>
<li>Alert on burn rate rather than a static threshold: a fast burn of the error budget pages immediately, a slow burn opens a ticket.</li>
<li>Every alert needs an owner, a runbook and a link to the query that produced it. An alert without an action is noise with a schedule.</li>
<li>Track the share of pages that led to action. When it falls, fix the alerts rather than the people ignoring them.</li>
</ul>
<h2>Instrument the domain, not only the framework</h2>
<p>Automatic instrumentation covers HTTP handlers, database calls and outbound requests, which is a good baseline and tells you nothing about your business. Add spans and events for the operations that matter in your domain: payment authorised, document generated, export queued. When these carry attributes such as tenant, plan and size, the same telemetry answers both engineering and product questions, and an incident can be scoped to the affected customers in one query rather than inferred.</p>
<aside class="tip">Connect deployments to your telemetry. Marking releases on every chart turns the most common question in an incident, what changed, from an investigation into a glance, and it makes the correlation between a regression and its cause visible to everyone rather than only to whoever remembers the deploy.</aside>`,
      Expert: `<p>Observability is a property of a system's telemetry: the degree to which internal state can be inferred from external output. The useful formalisation is that you should be able to answer arbitrary questions about behaviour without deploying new instrumentation, which requires wide events with high dimensionality rather than a fixed set of pre aggregated numbers.</p>
<h2>Wide events subsume the three pillars</h2>
<p>Splitting telemetry into logs, metrics and traces is an artefact of the tools rather than of the problem. A single wide event per unit of work, carrying dozens of dimensions including identifiers, timings, sizes, versions, flags and outcomes, can be aggregated into metrics, threaded into traces by its identifiers and read as a log. The practical benefit is that the dimensions you did not think to pre aggregate are still present, which is exactly the case where a novel failure is diagnosed. The cost is storage and query engineering, which is why the pre aggregated model persists for the small number of series that must be queried cheaply and continuously.</p>
<h2>Where the practice commonly falls down</h2>
<ul>
<li><strong>Averaging percentiles is invalid.</strong> Quantiles do not compose, so averaging per instance ninety ninth percentiles produces a number with no meaning. Aggregate from histograms, and know whether the backend is computing them exactly or approximately.</li>
<li><strong>Counters reset.</strong> Every rate calculation must handle restarts, and a dashboard that does not will show impossible negative rates during exactly the deployment you are investigating.</li>
<li><strong>Context propagation is the whole game.</strong> One library or one queue hop that drops the <strong>trace identifier</strong> converts a coherent tree into orphans, and the failure is silent because each fragment looks fine on its own.</li>
<li><strong>Telemetry is a data protection surface.</strong> Attributes flow to third party backends and are retained for months, so field level redaction, retention limits and access control belong in the instrumentation layer rather than in the backend's settings page.</li>
<li><strong>Objectives must be about journeys.</strong> A per endpoint availability target can be met while the checkout flow, which spans five endpoints, fails routinely for a subset of users.</li>
</ul>
<h2>Cost as a design constraint</h2>
<p>Telemetry volume grows with traffic and with instrumentation, so an unbounded approach becomes one of the larger line items in an infrastructure budget and is then cut indiscriminately during a cost review. Designing for cost from the start is more durable: retain full fidelity for a short window and aggregates for a long one, sample the ordinary and keep the exceptional, and hold high cardinality dimensions in events rather than in metric labels. The objective is that the questions you actually ask during an incident remain answerable, which is a much smaller and more tractable requirement than keeping everything.</p>
<aside class="tip">Write the incident review before the incident. Listing the three questions you would need to answer for each plausible failure, and confirming that current telemetry answers them, finds the gaps while it is cheap. Every question you cannot answer today is one you will be trying to answer under pressure later.</aside>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Why is a structured log line preferable to a prose message?",
        options: [
          "It uses less storage",
          "It can be filtered, grouped and counted by field rather than only searched as text",
          "It is easier for humans to read at a glance",
          "It avoids the need for log levels",
        ],
        answer: 1,
        explanation:
          "Emitting key value data makes every field queryable, so questions such as how many failures of this kind occurred for this tenant become aggregations rather than fragile text matching. Prose is arguably nicer to read line by line, which is precisely the trade being made: readability of one line for analysability of millions.",
        difficulty: "Easy",
        skill: "Structured logging",
      },
      {
        n: 2,
        question:
          "A counter is labelled with the full request path including record identifiers. What is the consequence?",
        options: [
          "Nothing, labels are free",
          "Each distinct path creates its own time series, so cardinality grows without bound and can overwhelm the backend",
          "The counter stops incrementing above a threshold",
          "Paths are automatically normalised by the metrics library",
        ],
        answer: 1,
        explanation:
          "Metrics are cheap only because they aggregate, and a label with unbounded values defeats that by creating a separate series per value. Assuming normalisation happens for you is a common and expensive belief, since the library cannot know which path segments are identifiers.",
        difficulty: "Medium",
        skill: "Metrics and cardinality",
      },
      {
        n: 3,
        question:
          "Traces from one request appear as several disconnected fragments. What is the most likely cause?",
        options: [
          "The sampling rate is too low",
          "The trace identifier is not being propagated across one of the boundaries",
          "Spans are being recorded with the wrong timestamps",
          "The service names are duplicated",
        ],
        answer: 1,
        explanation:
          "A trace is assembled from a shared identifier passed through every call, so a hop that drops it starts a new root and the tree splits. Low sampling would remove traces entirely rather than fragment them, which is what distinguishes the two symptoms.",
        difficulty: "Medium",
        skill: "Correlation identifiers",
      },
      {
        n: 4,
        question:
          "Why is average latency a poor headline metric?",
        options: [
          "It is expensive to compute",
          "It conceals the tail, so a service can look healthy while a meaningful share of requests are very slow",
          "It cannot be compared between services",
          "It is undefined when traffic is low",
        ],
        answer: 1,
        explanation:
          "Users experience individual requests, and a small share of very slow ones is invisible in a mean dominated by fast ones, which is why percentiles are reported instead. Cost is not the issue: the average is the cheapest statistic available and still the wrong one.",
        difficulty: "Easy",
        skill: "Service level objectives",
      },
      {
        n: 5,
        question:
          "Which condition is the better candidate for paging a human?",
        options: [
          "Processor usage above eighty percent for ten minutes",
          "The checkout success rate has fallen below its objective and the error budget is burning fast",
          "A single unhandled exception appearing in the logs",
          "Disk usage crossing fifty percent",
        ],
        answer: 1,
        explanation:
          "Pages should fire on symptoms users feel, with an action attached, and a fast burn of the error budget is exactly that. High processor usage is a routine state for a healthy system, and paging on it trains people to dismiss alerts, which is how a real one gets missed.",
        difficulty: "Medium",
        skill: "Alert design",
      },
      {
        n: 6,
        question:
          "What advantage does tail based sampling have over head based sampling?",
        options: [
          "It requires less memory in the collector",
          "It decides after the outcome is known, so errors and slow requests can be kept while ordinary ones are discarded",
          "It removes the need to propagate a trace identifier",
          "It samples each service independently",
        ],
        answer: 1,
        explanation:
          "Deciding at the end means the interesting traces, the failures and the tail latencies, are retained at a much higher rate than the unremarkable ones. It costs more memory rather than less, because spans must be buffered until the decision can be made, which is the trade being accepted.",
        difficulty: "Hard",
        skill: "Distributed tracing",
      },
      {
        n: 7,
        question:
          "Why can you not average the ninety ninth percentile latencies reported by ten instances?",
        options: [
          "The instances may have different clocks",
          "Quantiles do not compose, so the mean of percentiles is not the percentile of the combined distribution",
          "Percentiles are always reported as integers",
          "Averaging requires equal traffic per instance",
        ],
        answer: 1,
        explanation:
          "A percentile is a rank in a distribution and combining distributions requires the underlying data, which is why histograms are aggregated instead and the quantile computed from the total. Unequal traffic makes the error worse but is not the root problem: the operation is invalid even with perfectly equal traffic.",
        difficulty: "Hard",
        skill: "Metrics and cardinality",
      },
      {
        n: 8,
        question:
          "An availability objective is met for every individual endpoint, yet users report that checkout frequently fails. What is the likely gap?",
        options: [
          "The objective window is too long",
          "The objective measures endpoints rather than the multi step journey, where independent small failure rates compound",
          "The metrics backend is dropping data",
          "Latency is being measured at the wrong percentile",
        ],
        answer: 1,
        explanation:
          "A journey crossing five endpoints fails if any step fails, so five individually acceptable failure rates combine into a much worse user visible rate. Suspecting dropped data is the tempting explanation, but the numbers here are accurate and simply measuring the wrong unit.",
        difficulty: "Hard",
        skill: "Service level objectives",
      },
    ],
  },

  5020: {
    topicId: 5020,
    title: "Capstone: ship a full application",
    summary:
      "Build and deploy one complete application that exercises every layer of this course, and defend the decisions you made in a short written record that a reviewer can follow.",
    concepts: [
      "Scope definition",
      "Vertical slice delivery",
      "Schema and API design under constraint",
      "Deployment and rollback",
      "Evidence of quality",
      "Written decision records",
    ],
    glossary: {
      "Vertical slice":
        "One complete user journey implemented through every layer, from interface to database, before any layer is broadened.",
      "Definition of done":
        "The agreed list a piece of work must satisfy before it is called finished, typically tests, documentation and deployment.",
      "Decision record":
        "A short written note capturing a decision, the alternatives considered and the reason, dated and kept with the code.",
      "Seed data":
        "A reproducible dataset that makes the deployed application demonstrable and the tests deterministic.",
      "Smoke test":
        "A very small set of checks run against a deployed environment to confirm the critical path works.",
      "Runbook":
        "Written instructions for operating and recovering the system, including rollback and known failure modes.",
    },
    body: {
      Beginner: `<p>This is the piece of work you will show people. It should be small enough to finish and complete enough to be real: an application with accounts, data that belongs to those accounts, and a deployed address that works for a stranger.</p>
<h2>Pick something with a shape</h2>
<p>Good candidates share a structure: users own things, things have a state that changes, and lists of things need filtering and paging. A reading list, a small issue tracker, a recipe box, a study planner. Avoid anything that needs an unusual integration or a large dataset to be interesting.</p>
<h2>Build one slice at a time</h2>
<p>Resist building the whole database first, then the whole API, then the interface. Instead choose one journey, for example creating an item and seeing it in a list, and build it all the way through. You will have something working within a day and a real answer to every question about how the layers fit.</p>
<h2>What finished means</h2>
<ul>
<li>A stranger can sign up, sign in, and see only their own data.</li>
<li>Every list is paged and every form reports errors clearly.</li>
<li>The application is deployed, and the address works on a phone.</li>
<li>There are tests, and the pipeline runs them on every push.</li>
<li>The repository has a readme that gets a new person running locally in under ten minutes.</li>
</ul>
<aside class="tip">Write down the three things you deliberately did not build and why. A scope you chose is a sign of judgement, whereas a missing feature nobody mentions looks like something you forgot.</aside>`,
      Intermediate: `<p>The capstone is assessed on the same grounds a first professional project is: does it work for a user who is not you, is it built from decisions you can defend, and can somebody else run and change it.</p>
<h2>Required scope</h2>
<ul>
<li><strong>Data model.</strong> At least three related tables with declared foreign keys, an appropriate primary key strategy and constraints that make invalid rows impossible rather than unlikely.</li>
<li><strong>API.</strong> Resource shaped endpoints, one consistent error format, paged collections with a total ordering, and validation at the boundary with useful field level messages.</li>
<li><strong>Authentication.</strong> Password hashing with a purpose built algorithm, sessions or tokens with a stated revocation story, and authorisation checked on every request rather than at login only.</li>
<li><strong>Interface.</strong> A small number of screens that handle all four request states, keep the interface responsive during writes, and remain usable by keyboard alone.</li>
<li><strong>Delivery.</strong> A pipeline running checks and tests, deployment from a built artefact, and a rollback you have actually performed once.</li>
</ul>
<h2>Work in vertical slices</h2>
<p>Deliver one journey at a time through every layer. A <strong>vertical slice</strong> forces the integration questions early, when they are cheap, and it means that at any point you have something demonstrable rather than three half finished layers. Keep each slice small enough to merge within a day, and keep the main branch deployable throughout.</p>
<h2>Evidence, not assertions</h2>
<p>The written record is part of the work. For each significant decision, note what you chose, what you rejected and why, in three or four sentences. Typical subjects are the session mechanism, the pagination style, where validation lives, and which parts you chose not to test. A reviewer reading a <strong>decision record</strong> can tell the difference between a considered choice and a default that happened to work, and that distinction is most of what is being assessed.</p>
<aside class="tip">Provide reproducible <strong>seed data</strong> and a demonstration account. A reviewer who has to create records by hand before seeing anything work forms an impression of the product before they have seen it, and it is not the impression you want.</aside>`,
      Advanced: `<p>At this level the interesting part is not that it works but that it holds up under the conditions that break student projects: real quantities of data, concurrent editors, partial failure and a second person changing the code.</p>
<h2>Raise the bar deliberately</h2>
<ul>
<li>Seed at least fifty thousand rows in the main table and make every list endpoint meet a stated latency budget at that size. Show the query plan for the two heaviest queries.</li>
<li>Implement optimistic concurrency on updates so two editors produce a visible conflict rather than a lost change.</li>
<li>Make creation idempotent with a client supplied key, and demonstrate that a retried request does not create a duplicate.</li>
<li>Virtualise or page any list that can grow without bound, and keep interaction latency acceptable while it is loading.</li>
<li>Handle the failure paths explicitly: what a user sees when a request times out, when they are offline, and when the server rejects a stale write.</li>
</ul>
<h2>Migrations and operations</h2>
<p>Include at least one schema change made after the first deployment, delivered with the expand and contract pattern so that no deployment window requires downtime. Write a short <strong>runbook</strong> covering how to deploy, how to roll back, how to restore the database, and the two or three failure modes you consider most likely with their first diagnostic step. Add a <strong>smoke test</strong> that runs against the deployed environment after every release and fails the deployment if the critical path is broken.</p>
<h2>Make quality legible</h2>
<p>Choose the tests that carry weight rather than maximising their number: unit tests around the rules with branches, integration tests against a real database for the queries and transactions, and a couple of end to end tests over sign in and the primary journey. State in the readme what is deliberately untested and why. A reviewer should be able to run everything with one command and read the failure output without asking you what it means.</p>
<aside class="tip">Instrument before you need to. A request identifier on every log line, a trace across the API and database, and one dashboard showing request rate, error rate and tail latency take an afternoon and turn every later question about the deployed application into a query rather than a guess.</aside>`,
      Expert: `<p>Treat this as a demonstration of engineering judgement under constraint. The system is small, so nothing about it is hard in isolation; what is being examined is whether the choices form a coherent whole and whether you can articulate their consequences.</p>
<h2>Name the constraints and design to them</h2>
<p>Begin the written record with the assumptions the design rests on: expected data volume and growth, read to write ratio, acceptable staleness, latency budget for the primary journey, recovery objectives if the database is lost, and how many people will maintain the code. Every subsequent decision is then evaluable against a stated context rather than in the abstract. This single practice is what separates a defensible design from a collection of preferences, and it is the same document that makes the system's limits legible to whoever inherits it.</p>
<h2>Where these projects usually fail review</h2>
<ul>
<li><strong>Authorisation checked at the wrong layer.</strong> Filtering by owner in the interface while the endpoint accepts any identifier is the most common serious defect, and it is invisible until someone changes a value in a request.</li>
<li><strong>Pagination without a total order.</strong> Paging over a non unique sort key duplicates and drops rows, and it only shows at volume, which is why the seed dataset must be large.</li>
<li><strong>Transactions scoped to the wrong boundary.</strong> Writing a parent and its children in separate transactions leaves partial state whenever the second fails, and nothing in a happy path test will notice.</li>
<li><strong>Irreversible migrations shipped in one step.</strong> A drop in the same release as the code that stopped using the column removes the ability to roll back, exactly when it is most likely to be needed.</li>
<li><strong>An unbounded query behind an innocuous screen.</strong> A dashboard aggregate without a limit or an index is the standard cause of the first outage.</li>
</ul>
<h2>What to present</h2>
<p>Prepare a ten minute walkthrough with four parts: the journey working in the deployed application, the schema with its constraints and the reasoning behind the key choices, one query with its plan before and after the index you added, and one incident you caused deliberately, with the telemetry that identified it and the rollback that resolved it. That last part is worth more than any feature, because it is the only evidence that the system was built by someone who expected it to fail and prepared accordingly.</p>
<aside class="tip">Write the readme for the person who will maintain this after you, not for the person marking it. Prerequisites, one command to run, one command to test, where configuration comes from, and what to do when it does not start. A project somebody else can run is a project somebody else can hire you for.</aside>`,
    },
  },
};

export default CURRICULUM;
