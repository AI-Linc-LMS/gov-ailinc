import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 319, Digital Marketing & ONDC for Rural Businesses.
 *
 * Every `skill` below is a single word lifted from the title of the topic the question
 * belongs to, because `conceptsFor` in http/handlers/adaptive-courses.ts derives a topic's
 * concepts by splitting its title and keeping at most four words, and `bankForTopic` matches
 * this skill against that list case-insensitively.
 *
 * Skills used, module by module:
 *   1 Profile, Product, Description        4 UPI, Pricing, GST
 *   2 WhatsApp, Broadcast, Instagram       5 Local, Ratings
 *   3 Marketplace, ONDC, Seller, Order     6 Conversion, Product
 *
 * Three of these (Profile, WhatsApp, Pricing) sit on topics whose only practice item is an
 * assignment, so no quiz on this course lists them as a target skill and those questions are
 * always served as filler rather than as on-topic. That is deliberate: the alternative was to
 * mislabel a question about a WhatsApp catalogue with a word from a different lesson.
 *
 * The correct option is spread across all four positions (A x4, B x4, C x5, D x4), so that a
 * learner cannot read the key off the screen.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 319001: getting your business found ---- */
  mcq(
    319,
    1,
    "You create a free business listing for your shop and fill in every field on it. Which entry does most to decide whether that listing appears when somebody nearby searches for what you sell?",
    [
      "The business category you pick, together with an address that has been verified",
      "The length of the description you write in the about section",
      "Putting the names of the products you sell into the business name itself",
      "The number of photographs you upload in the first week",
    ],
    0,
    "Easy",
    "Profile",
    "The category is the field the search engine matches against the words a person typed, and a verified address is what makes you eligible to be shown for a nearby search at all. Until both are right, nothing else on the listing gets a chance to work. The description is the tempting answer because it is the field with the most words in it, but it is read by somebody who has already found you, so filling it with product names does not make you appear for those words. Putting products into the business name is worse than useless: it is against the policy of every major listing service and it gets listings suspended.",
  ),
  mcq(
    319,
    2,
    "You are photographing a handloom bedsheet for an online listing with a phone camera and no studio. Which of these does most to make the photograph usable?",
    [
      "Shooting in direct midday sun, so that the colours come out bright",
      "Standing back and using the phone's digital zoom to fill the frame",
      "Shooting in open shade or beside a window, against a plain background, with the whole product in frame",
      "Applying a strong filter so the colour looks richer than the cloth actually is",
    ],
    2,
    "Easy",
    "Product",
    "Soft light from open shade or a window shows the true colour and the weave without hard shadows, and a plain background stops the eye wandering to the cot and the wall behind. Getting the whole product in frame is what lets a buyer judge the proportion. Direct sun is the tempting answer, because bright feels like clear, but at noon it burns out the pale areas of the cloth and throws a hard shadow across the fold. The filter is the dangerous one: the buyer compares the parcel against the photograph, and a colour that does not match is the single most common reason for a return and a one star rating.",
  ),
  mcq(
    319,
    3,
    "Two sellers list the same 500 gram packet of turmeric powder. One description is three lines praising the quality. The other states the district it was grown in, the packing date, the net weight, that there is nothing added to it, and how to store it. Why does the second usually convert better?",
    [
      "Search engines rank a longer description higher",
      "It settles, before the buyer thinks to ask, the questions that otherwise stop the order or arrive as a message you have to answer",
      "Marketplaces do not permit adjectives in a product description",
      "It carries more keywords, so it turns up in more searches",
    ],
    1,
    "Medium",
    "Description",
    "Every unanswered question is either a closed tab or a message sitting in your phone, and a buyer deciding at ten at night will not wait until morning for your reply. Net weight, ingredients, packing date and storage are what actually do the selling on a food item. The keyword answer is tempting and it is half true, since specific words do help you get found, but it treats the description as something written for the search engine. A listing that ranks well and then fails to answer the buyer earns you a view and no order, which is the pattern you will see later in the course when conversion is low while views are high.",
  ),

  /* ---- Module 319002: WhatsApp and social selling ---- */
  mcq(
    319,
    4,
    "In WhatsApp Business, what are labels for?",
    [
      "Tagging a product so that it turns up in a customer's search",
      "Adding a price sticker on to a photograph before you send it",
      "Showing the customer which business category you belong to",
      "Marking your own chats and orders, so you can see at a glance which enquiry is unanswered, which order is packed and which is still unpaid",
    ],
    3,
    "Easy",
    "WhatsApp",
    "A label is private to you. It sits on a chat or an order and turns a scrolling list of conversations into a work queue, which is exactly what a one person shop needs on a day with thirty enquiries. Tagging a product for search is the tempting answer, because the same word means precisely that on a marketplace listing, but a WhatsApp label is never shown to the customer and does nothing at all to help anybody find you. The catalogue, not the label, is the part of WhatsApp Business that faces the buyer.",
  ),
  mcq(
    319,
    5,
    "You want to send a festival offer to 200 customers. What is the practical difference between a broadcast list and a group?",
    [
      "A broadcast reaches everybody, whereas a group only reaches the members who are online",
      "A broadcast arrives as a private one to one chat and reaches only those contacts who have saved your number, while in a group every member can see and message every other member",
      "A group is free, while a broadcast is charged for each message sent",
      "A broadcast can carry photographs, while a group cannot",
    ],
    1,
    "Easy",
    "Broadcast",
    "Two things follow from that difference. Your customers' numbers stay private and each reply comes back to you as a separate chat, which is what you want when an offer goes out; and delivery depends on the customer having saved your number, which is why the first message to a new contact should ask them to save it. The group is the tempting choice because it feels like it reaches more people in one action, and it does, but you have also handed 200 customers each other's numbers and given every one of them, your competitor included, the ability to message your whole customer list.",
  ),
  mcq(
    319,
    6,
    "A small unit posts on Instagram every day for a month, gains followers steadily, and receives no enquiries at all. What is most likely to be missing?",
    [
      "A paid promotion behind every post",
      "A verification tick on the account",
      "A visible way to buy: a contact or WhatsApp button on the profile, a stated price, and where you are",
      "More followers than the nearest competitor has",
    ],
    2,
    "Medium",
    "Instagram",
    "Followers and reach are not orders. An account that shows attractive photographs but never states a price, a location or a way to reach you is asking an interested person to go and do the work of finding you, and most of them will not bother. The profile is where that work is removed, with a contact button, an address and a pinned post saying what you sell and what it costs. Paid promotion is the tempting answer because spending feels like the missing ingredient, but paying to push more people towards a profile that does not tell them how to buy only wastes the money faster.",
  ),

  /* ---- Module 319003: selling online ---- */
  mcq(
    319,
    7,
    "What is the main trade off between selling on a large marketplace and selling from your own website?",
    [
      "The marketplace brings you buyers but keeps the customer relationship and charges a commission on every order, while your own store keeps both the customer and the margin and brings you no buyers on its own",
      "The marketplace is free to use, while your own store costs money every month",
      "Your own store can accept UPI payments, while a marketplace cannot",
      "A marketplace does not let you set your own price",
    ],
    0,
    "Medium",
    "Marketplace",
    "A marketplace is rented footfall. It sends you buyers who came for the platform rather than for you, it charges for that through commission, and the buyer's contact details usually stay with the platform. Your own store reverses both halves: no commission and a customer you can message again next season, but nobody arrives unless you bring them yourself. The free answer is tempting because listing costs nothing upfront, but the commission on every order is the price, and on thin margin goods it is by far the larger of the two costs.",
  ),
  mcq(
    319,
    8,
    "What does it mean to say that ONDC is an open network rather than a platform?",
    [
      "Listing and selling on it carry no charge of any kind",
      "It is a government owned shopping application that buyers download",
      "Every seller on the network has to offer the same price for the same item",
      "You list once through a seller side application, and buyers using any other compatible application on the network can find and order from that same listing",
    ],
    3,
    "Medium",
    "ONDC",
    "The network defines the protocol that buyer side and seller side applications use to speak to each other, so discovery, ordering and fulfilment are unbundled from any one company's application. You are onboarded by a seller network participant, and your catalogue then becomes visible to buyers using participants you have no relationship with. The government shopping app is the most common wrong answer, and it is wrong in the way that costs a seller time: there is no ONDC application for a buyer to install, so a seller who mistakes the network for an app sits waiting for downloads that are never going to happen.",
  ),
  mcq(
    319,
    9,
    "You sell the same goods across the counter and through a seller application, and you keep one stock number for both. What does that cost you, once the shop has a busy day?",
    [
      "The listing hides itself the moment the count reaches zero, so you lose the views you had built up",
      "The platform holds your settlement until you correct the count",
      "You accept orders for units already sold in the shop, and the seller cancellations that follow are recorded against your account and pull the listing down, which costs far more than the one sale",
      "Your product is ranked lower for showing low stock, so the sensible fix is to enter a large stock figure and keep the listing visible",
    ],
    2,
    "Hard",
    "Seller",
    "A seller cancellation is the worst thing an account can record. The buyer who was cancelled on does not come back, and the cancellation rate follows your account into how your listings are ranked and, past a point, into whether you stay on the network at all. The fix is unglamorous: hold a buffer, so the quantity you publish online is deliberately less than what is on the shelf, and update it once a day. Option A describes a real effect, and it is the tempting one because it is the visible one, but a listing going out of stock is recoverable in a day whereas the cancellations are recorded permanently. Option D is the trap this whole topic exists to prevent, since inflating the stock figure produces exactly the cancellations described.",
  ),
  mcq(
    319,
    10,
    "A courier bills on whichever is greater, the actual weight or the volumetric weight, where volumetric weight in kilograms is length times breadth times height in centimetres divided by 5,000. You pack a 1.2 kg item into a carton measuring 40 cm by 30 cm by 25 cm. What weight is charged?",
    ["1.2 kg", "6 kg", "3.6 kg", "7.2 kg"],
    1,
    "Hard",
    "Order",
    "The carton is 40 times 30 times 25, which is 30,000 cubic centimetres, and dividing by 5,000 gives a volumetric weight of 6 kg. That is greater than the actual 1.2 kg, so the courier bills 6 kg. The actual weight is the tempting answer because it is the number your own weighing scale shows, and a seller who prices delivery from the scale alone loses money on every item that is bulky and light: pillows, snack packets, garments and anything packed with loose filler. The practical lesson is that a smaller carton is a genuinely cheaper carton, so pack tight and cut the box down to the goods.",
  ),

  /* ---- Module 319004: payments and money ---- */
  mcq(
    319,
    11,
    "A customer at your counter shows you a screen on their phone saying the UPI payment was successful, but nothing has arrived in your account. What should you do?",
    [
      "Hand over the goods, since a success screen on the payer's phone is proof of a credit to you",
      "Ask the customer to make the payment again straight away",
      "Check your own bank or merchant application for the credit, and if it is not there write down the customer's UPI transaction reference and let the settlement or the auto reversal finish before you release the goods",
      "Refuse the sale and tell the customer to bring cash next time",
    ],
    2,
    "Easy",
    "UPI",
    "Only a credit you can see in your own account is proof of payment to you. A success screen on somebody else's phone shows that money left their account, and a small proportion of those are still in process or will be reversed automatically, which is precisely why the transaction reference number is the thing to note down. Asking the customer to pay again is the tempting instruction because it clears the counter, and it is how a customer ends up debited twice with a refund that takes days, a bad experience they will describe to everybody in the village. Screenshots of a success page are also the commonest counter fraud there is.",
  ),
  mcq(
    319,
    12,
    "You make and pack a jar for ₹140. Delivery costs ₹20 and you have decided to absorb it rather than charge it separately. The platform deducts 20 per cent commission on the price the buyer pays. Ignoring tax, what must you list the jar at so that ₹40 is left for you?",
    ["₹200", "₹225", "₹240", "₹250"],
    3,
    "Hard",
    "Pricing",
    "Commission is charged on the price the buyer pays, not on what reaches you, so you work backwards from what you need in hand: ₹140 of cost plus ₹20 of delivery plus ₹40 of margin is ₹200. That ₹200 is the 80 per cent left after commission, so the listed price is 200 divided by 0.8, which is ₹250. Check it: the buyer pays ₹250, the platform keeps ₹50, you receive ₹200 and after ₹160 of costs you are left with exactly ₹40. ₹240 is the tempting answer and it is the arithmetic slip that quietly eats a small unit's margin, because it adds 20 per cent on to ₹200 instead of dividing by 0.8. At ₹240 the commission is ₹48, you receive ₹192, and your margin is ₹32.",
  ),
  mcq(
    319,
    13,
    "You are registered under GST in Telangana and you dispatch an order to a buyer in Maharashtra. Which tax goes on the invoice?",
    [
      "IGST, because the supply moves from one state to another",
      "CGST and SGST, because your registration is in Telangana",
      "CGST and SGST of Maharashtra, because that is where the buyer is",
      "Nothing, because the sale was routed through an online platform",
    ],
    0,
    "Hard",
    "GST",
    "The split follows the place of supply. Where the supplier's state and the place of supply are the same, it is an intra state supply and the tax is charged in two halves as CGST plus SGST. Where they differ, it is an inter state supply and a single IGST is charged instead, at the same overall rate. Option B is the tempting one because your registration is in Telangana and it feels as though that should settle the question, but registration decides who is liable and where the return is filed, not which head applies. Selling through a platform changes none of this either: the invoice to the buyer is still issued by you, in your own name.",
  ),

  /* ---- Module 319005: getting the first hundred orders ---- */
  mcq(
    319,
    14,
    "Two buyers place the same ₹600 order. One is in the next mandal and one is 900 km away. Why is the near buyer worth more to a new unit?",
    [
      "The near order carries a lower platform commission",
      "The far order counts for less towards your seller rating",
      "The far order is settled into your bank account more slowly",
      "Delivery costs less, a complaint can be settled inside the same week, and the near buyer is the one who orders again and tells a neighbour",
    ],
    3,
    "Easy",
    "Local",
    "Distance costs you on every axis that matters to a small unit. The courier bills more, a return pays that freight twice, and a problem that could have been settled by driving over becomes a chain of messages and then a public one star review. Set against that, the near buyer is the one who places a second order, and a repeat order costs you nothing to win. Commission is the tempting answer because it is the deduction a seller notices most, but the platform charges the same rate whatever the distance, so that is not where the difference sits.",
  ),
  mcq(
    319,
    15,
    "A buyer leaves a one star review saying the parcel arrived with the packet torn. What is the best public reply?",
    [
      "No reply at all, so that the review is not pushed further up the page",
      "A short reply that names the specific problem, says what you are doing about this order, and moves the rest to a call or a private message",
      "A reply explaining that the courier was at fault and the seller carries no responsibility for handling in transit",
      "A request that the buyer take the review down first, after which you will look into it",
    ],
    1,
    "Medium",
    "Ratings",
    "The public reply is not written for the person complaining, who already knows what happened. It is written for the next fifty people reading that review while they decide whether to order from you, and what they are judging is whether a problem gets handled. Naming the issue, saying what you are doing and taking the detail private does that in three lines. Blaming the courier is the tempting reply because it is very often factually true, but the buyer bought from you and not from the courier, and a reply that disclaims responsibility tells every future reader exactly what will happen when their own parcel goes wrong.",
  ),

  /* ---- Module 319006: measuring and improving ---- */
  mcq(
    319,
    16,
    "In one week your listing was viewed 800 times and produced 16 orders. The next week you spent on advertising, views rose to 2,400 and orders rose to 24. What does that tell you?",
    [
      "The advertising worked, since orders rose by half",
      "Conversion was unchanged, because views and orders both rose",
      "Orders rose but conversion fell from 2 per cent to 1 per cent, so the extra visitors bought at half the earlier rate, and the listing and the targeting are what to fix before you spend more",
      "Conversion rose from 2 per cent to 3 per cent",
    ],
    2,
    "Hard",
    "Conversion",
    "Conversion is orders divided by views. In the first week that is 16 divided by 800, which is 2 per cent, and in the second it is 24 divided by 2,400, which is 1 per cent. Each extra hundred visitors bought at half the old rate, which is what broad and poorly targeted traffic looks like. Option A is tempting because eight extra orders is a real gain and the headline number moved the right way, but a rate that halves as spend rises is the signal that more spend will keep getting worse. The cheaper repair is on the listing itself, the price, the photographs, the delivery time and the stock you show, and on who the advertisement is being shown to.",
  ),
  mcq(
    319,
    17,
    "When is a one person unit ready to add a second product line?",
    [
      "When the first product sells steadily to repeat buyers, and making, packing and dispatching it fits inside your week with time to spare",
      "As soon as the first product has been listed for three months",
      "When a competitor in the same district adds one",
      "When the first product has stopped selling, so that the second can replace it",
    ],
    0,
    "Medium",
    "Product",
    "A second line multiplies everything that is already tight: stock to hold, photographs to shoot, two listings to keep accurate, and packing on a day when both happen to sell. It is safe to add once the first product runs on a routine rather than on your full attention, and it is best chosen to use the same buyer, the same packing and the same season, so the new work is only the making. Option D is the tempting one, because a falling product feels exactly like the moment to act, but adding a line then means learning a new product with no cash coming in and no evidence yet about what went wrong with the first.",
  ),
];

export default BANK;
