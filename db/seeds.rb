require "securerandom"
require "date"

puts "Cleaning database..."

Message.destroy_all
ChatMembership.destroy_all
Chat.destroy_all
Attendance.destroy_all
EventInterest.destroy_all
UserInterest.destroy_all
Event.destroy_all
User.destroy_all
Interest.destroy_all
City.destroy_all

puts "Creating European capital cities..."

rome_seed = City.find_or_create_by!(name: "Rome") { |c| c.country_code = "IT" }

User.find_or_create_by!(email: "melissa@urbanmeet.com") do |user|
  user.name = "Melissa"
  user.city = rome_seed
  user.password = "password123"
  user.password_confirmation = "password123"
end

# Note: your schema uses cities.name + cities.country_code
# country_code is ISO 3166-1 alpha-2 (e.g., IT, DE, FR)
capitals = [
  ["Andorra la Vella", "AD"],
  ["Vienna", "AT"],
  ["Brussels", "BE"],
  ["Sarajevo", "BA"],
  ["Sofia", "BG"],
  ["Minsk", "BY"],
  ["Bern", "CH"],
  ["Nicosia", "CY"],
  ["Prague", "CZ"],
  ["Berlin", "DE"],
  ["Copenhagen", "DK"],
  ["Tallinn", "EE"],
  ["Madrid", "ES"],
  ["Helsinki", "FI"],
  ["Paris", "FR"],
  ["London", "GB"],
  ["Athens", "GR"],
  ["Zagreb", "HR"],
  ["Budapest", "HU"],
  ["Dublin", "IE"],
  ["Reykjavik", "IS"],
  ["Rome", "IT"],
  ["Vaduz", "LI"],
  ["Vilnius", "LT"],
  ["Luxembourg", "LU"],
  ["Riga", "LV"],
  ["Monaco", "MC"],
  ["Chisinau", "MD"],
  ["Podgorica", "ME"],
  ["Skopje", "MK"],
  ["Valletta", "MT"],
  ["Amsterdam", "NL"],
  ["Oslo", "NO"],
  ["Warsaw", "PL"],
  ["Lisbon", "PT"],
  ["Bucharest", "RO"],
  ["Belgrade", "RS"],
  ["Stockholm", "SE"],
  ["Ljubljana", "SI"],
  ["Bratislava", "SK"],
  ["San Marino", "SM"],
  ["Kyiv", "UA"],
  ["Vatican City", "VA"],
  ["Tirana", "AL"]
]

cities = capitals.map { |name, code| City.create!(name: name, country_code: code) }

rome   = City.find_by!(name: "Rome")
berlin = City.find_by!(name: "Berlin")
paris  = City.find_by!(name: "Paris")

puts "Creating interests..."

interest_names = [
  "Tech & Startups",
  "Hiking",
  "Language Exchange",
  "Photography",
  "Art & Museums",
  "Food & Wine",
  "Running",
  "Yoga",
  "Book Club",
  "Networking",
  "Gaming",
  "Dog Walks",
  "Restaurant Exploring",
  "Pilates",
  "Nature Walks",
  "Sightseeing",
  "Brunch",
  "Theater & Opera",
  "Arts & Crafts",
  "Cooking",
  "Learning",
  "Personal Development"
]

interests = interest_names.map { |name| Interest.create!(name: name) }

puts "Creating users..."

first_names = %w[Melissa Luca Anna Jonas Claire Thomas Elena Marco Sofia Leon Mia Noah Sara Paul Lea David Julia Niklas Chiara Emma Liam Nora Max]
last_names  = %w[Laurenti Rossi Schmidt Weber Dubois Martin Fischer Bianchi Conti Romano Moretti Keller Bauer Klein Richter Novak Popov Silva Costa]

languages = %w[en it de fr es]

bio_templates = [
  "New in %{city} — looking for fun people to explore the city with!",
  "Coffee, conversations, and good vibes. Say hi 👋",
  "Always up for a walk, brunch, or discovering hidden places.",
  "Here to meet new friends and try new things.",
  "Love learning, food spots, and spontaneous plans."
]

avatar_pool = %w[1f431 1f436 1f98a 1f430 1f43c 1f428 1f43b 1f427 1f981 1f42f 1f989 1f438].map do |code|
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/#{code}.png"
end

def random_birthday(min_age: 18, max_age: 40)
  today = Date.today
  start = today - max_age * 365
  finish = today - min_age * 365
  Date.jd(rand(start.jd..finish.jd))
end

users = []

45.times do |i|
  fn = first_names.sample
  ln = last_names.sample
  city = cities.sample
  name = "#{fn} #{ln}"

  users << User.create!(
    email: "#{fn.downcase}.#{ln.downcase}.#{i}@urbanmeet.test",
    name: name,
    bio: bio_templates.sample % { city: city.name },
    avatar_url: avatar_pool.sample,
    language: languages.sample,
    city: city,
    birthday: random_birthday,
    password: "password123",
    password_confirmation: "password123"
  )
end

# Melissa Demo User
melissa = User.create!(
  email: "melissa.laurenti@urbanmeet.test",
  name: "Melissa Laurenti",
  bio: "Based in Rome — building UrbanMeet and always up for brunch & city exploring ✨",
  avatar_url: avatar_pool.first,
  language: "en",
  city: rome,
  birthday: random_birthday(min_age: 24, max_age: 34),
  password: "password123",
  password_confirmation: "password123"
)

users << melissa

puts "Assigning interests to users..."

users.each do |user|
  user.interests << interests.sample(rand(4..7))
end

puts "Creating events (interest-driven)..."

event_templates = {
  "Tech & Startups" => [
    "Startup Aperitivo",
    "Co-Working & Coffee Meetup",
    "Founder Chats Night",
    "Product & Pitch Practice"
  ],
  "Hiking" => [
    "Sunset Hike",
    "Weekend Trail Adventure",
    "Easy Hike + Picnic",
    "Views & Photo Hike"
  ],
  "Language Exchange" => [
    "Language Exchange Café",
    "Speak & Sip Night",
    "Italian / English Exchange",
    "Meet & Talk: Multilingual Edition"
  ],
  "Photography" => [
    "Photography Walk",
    "Golden Hour Photo Hunt",
    "Street Photography Meetup",
    "Photo Spots Tour"
  ],
  "Art & Museums" => [
    "Museum Meetup",
    "Art Gallery Crawl",
    "Exhibition & Espresso",
    "Sketching in the Museum"
  ],
  "Food & Wine" => [
    "Wine & Networking Night",
    "Tasting Tour",
    "Food Market Adventure",
    "Pizza & Conversation"
  ],
  "Running" => [
    "Morning Run Crew",
    "5K Social Run",
    "Sunrise Jog + Coffee",
    "Easy Pace City Run"
  ],
  "Yoga" => [
    "Sunday Yoga in the Park",
    "Sunset Yoga Session",
    "Beginner-Friendly Yoga",
    "Stretch & Relax Flow"
  ],
  "Book Club" => [
    "International Book Club",
    "Book & Brunch Club",
    "Short Stories Night",
    "Read & Discuss Meetup"
  ],
  "Networking" => [
    "New in Town Networking",
    "Creative Networking Night",
    "Meet New Friends Mixer",
    "After-Work Social"
  ],
  "Gaming" => [
    "Gaming Night (Casual)",
    "Board Games & Snacks",
    "Co-op Games Meetup",
    "Retro Games Evening"
  ],
  "Dog Walks" => [
    "Dog Walk Meetup",
    "Park Walks with Dogs",
    "Sunday Dog Stroll",
    "Dogs & Coffee Walk"
  ],
  "Restaurant Exploring" => [
    "New Restaurant Try-Out",
    "Hidden Gems Dinner",
    "Street Food Evening",
    "Local Favorites Night"
  ],
  "Pilates" => [
    "Pilates Session (Beginner)",
    "Pilates + Coffee Chat",
    "Core & Posture Meetup",
    "Studio Pilates Trial"
  ],
  "Nature Walks" => [
    "Nature Walk & Chat",
    "Green Escape Walk",
    "Slow Walk + Mindful Break",
    "Parks & Paths Meetup"
  ],
  "Sightseeing" => [
    "City Highlights Tour",
    "Hidden Corners Walk",
    "Architecture Walk",
    "Sunset Viewpoints Tour"
  ],
  "Brunch" => [
    "Brunch Meetup",
    "Sunday Brunch Club",
    "Coffee & Croissants",
    "Brunch + Walk Combo"
  ],
  "Theater & Opera" => [
    "Theater Night Meetup",
    "Opera Evening (Group)",
    "Pre-Show Drinks + Theater",
    "Culture Night Out"
  ],
  "Arts & Crafts" => [
    "Paint & Chill",
    "Crafting Afternoon",
    "Watercolor Meetup",
    "DIY Art Night"
  ],
  "Cooking" => [
    "Cooking Night (Group)",
    "Pasta-Making Meetup",
    "Home Cooking & Friends",
    "Cook Together Night"
  ],
  "Learning" => [
    "Study Session (Focus)",
    "Language Learning Sprint",
    "Skill Swap Meetup",
    "Learn Together Café"
  ],
  "Personal Development" => [
    "Goal Setting Meetup",
    "Career Growth Circle",
    "Habit Building Session",
    "Mindset & Motivation Talk"
  ]
}

def random_address(city_name)
  streets = ["Main Street", "Via Roma", "Rue de Rivoli", "Friedrichstraße", "Market Square", "Old Town Road", "River Walk"]
  "#{streets.sample} #{rand(1..120)}, #{city_name}"
end

events = []

puts "Creating pinned highlight events..."

madrid = City.find_by!(name: "Madrid")
tirana = City.find_by!(name: "Tirana")

highlight_events_data = [
  {
    city: tirana,
    title: "Sunset Rooftop Meetup — Tirana",
    description: "Join us on one of Tirana's best rooftop spots for sunset views, good music, and new faces. A relaxed evening for expats, locals, and curious travellers.",
    address: "Blloku District, Tirana",
    interest_names: ["Networking", "Food & Wine"],
    starts_at: 1.day.from_now.change(hour: 18, min: 30)
  },
  {
    city: rome,
    title: "Evening Walk & Aperitivo — Rome",
    description: "A relaxed walk through Rome's historic centre — past the Pantheon, Piazza Navona, and Campo de' Fiori — followed by a group aperitivo. Perfect for newcomers and regulars alike.",
    address: "Piazza Navona, Rome",
    interest_names: ["Sightseeing", "Food & Wine"],
    starts_at: 2.days.from_now.change(hour: 17, min: 0)
  },
  {
    city: madrid,
    title: "Spanish / English Exchange — Madrid",
    description: "Practice your Spanish or help others with their English in a fun, informal setting. We meet at a cosy café in Malasaña — all levels welcome, just bring good energy!",
    address: "Calle del Pez 21, Madrid",
    interest_names: ["Language Exchange", "Networking"],
    starts_at: 3.days.from_now.change(hour: 19, min: 0)
  }
]

highlight_events_data.each do |data|
  ev = Event.create!(
    city: data[:city],
    host: melissa,
    title: data[:title],
    description: data[:description],
    address: data[:address],
    capacity: 20,
    status: "published",
    starts_at: data[:starts_at],
    ends_at: data[:starts_at] + 120.minutes
  )
  ev.interests << interests.select { |i| data[:interest_names].include?(i.name) }
  events << ev
end

all_cities = City.all.to_a

all_cities.each do |city|
  host_pool = users.select { |u| u.city_id == city.id }
  host_pool = users if host_pool.empty?

  # Pick 4 random interest categories for this city
  selected_interests = interests.sample(4)

  selected_interests.each do |main_interest|
    host = host_pool.sample
    title = (event_templates[main_interest.name] || ["Community Meetup"]).sample
    title = "#{title} — #{city.name}"

    starts_at = rand(1..21).days.from_now.change(hour: [10, 11, 17, 18, 19].sample, min: [0, 15, 30, 45].sample)
    ends_at = starts_at + [90, 120, 150].sample.minutes

    event = Event.create!(
      city: city,
      host: host,
      title: title,
      description: "A friendly meetup in #{city.name}. Come as you are — meet new people and enjoy the vibe.",
      address: random_address(city.name),
      capacity: [10, 12, 15, 20, 25].sample,
      status: "published",
      starts_at: starts_at,
      ends_at: ends_at
    )

    event.interests << ([main_interest] + interests.sample(rand(0..2))).uniq

    events << event
  end
end

puts "Creating attendances..."

events.each do |event|
  pool = users.select { |u| u.city_id == event.city_id && u.id != event.host_id }
  pool = users.reject { |u| u.id == event.host_id } if pool.size < 6

  attendees = pool.sample(rand(3..7))
  attendees.each do |u|
    Attendance.create!(user: u, event: event, status: "going")
  end
end

puts "Adding users to chats..."

events.each do |event|
  # event.chat should exist if your after_create callback is in place
  # Add host + attendees to chat
  members = ([event.host] + event.users).uniq

  members.each do |u|
    ChatMembership.create!(chat: event.chat, user: u)
  end
end

puts "Creating messages..."

sample_lines = [
  "Can’t wait for this! 🙌",
  "Anyone else new in town?",
  "What’s the best way to get there?",
  "I’m bringing a friend — hope that’s okay?",
  "See you soon! ✨",
  "Excited to meet everyone!"
]

events.each do |event|
  next unless event.chat

  members = ([event.host] + event.users).uniq
  next if members.empty?

  rand(3..6).times do
    Message.create!(
      chat: event.chat,
      user: members.sample,
      body: sample_lines.sample
    )
  end
end

puts "Done! 🌍 UrbanMeet is alive across Europe."
