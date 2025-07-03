import React from 'react';
import Navbar from '../components/Navbar';
import ExperienceCard from '../components/ExperienceCard';
import InterestCard from '../components/InterestCard';
import PlaceCard from '../components/PlaceCard';
import CollectionCard from '../components/CollectionCard';
import InspirationCard from '../components/InspirationCard';
import CardGrid from '../components/CardGrid';

const placeholder = 'https://placehold.co/400x250';
const avatar = 'https://placehold.co/64x64';

const LandingPage = () => (
  <div className="min-h-screen bg-white">
    {/* Navbar */}
    <Navbar />

    {/* Hero/Search Section */}
    <section className="w-full bg-white py-10">
      <div className="hero-container text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Where to?</h1>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['Search All', 'Hotels', 'Things to Do', 'Restaurants', 'Flights', 'Vacation Rentals'].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-900 font-semibold text-sm hover:bg-gray-100 shadow-sm transition"
            >
              {cat}
            </button>
          ))}
        </div>
        <form className="w-full max-w-2xl mx-auto flex items-center bg-white rounded-full shadow border border-gray-300 p-2">
          <input
            type="text"
            placeholder="Places to go, things to do, hotels..."
            className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800 text-lg"
          />
          <button type="submit" className="ml-2 px-6 py-2 rounded-full bg-primary-600 text-white font-bold hover:bg-primary-700 transition">
            Search
          </button>
        </form>
      </div>
    </section>

    {/* Hero Card */}
    <section className="w-full py-8">
      <div className="page-container">
        <div className="bg-pink-200 rounded-2xl p-0 flex flex-col md:flex-row overflow-hidden shadow-lg min-h-[220px]">
          <img src={placeholder} alt="Trip" className="w-full md:w-64 h-48 object-cover" />
          <div className="flex-1 flex flex-col justify-center p-6">
            <span className="inline-block bg-white text-xs font-semibold text-gray-700 rounded-full px-3 py-1 mb-2">@PhylGan</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Book the best part of your trip</h2>
            <p className="text-gray-700 mb-4">Browse unforgettable things to do—right here.</p>
            <button className="bg-primary-600 text-white rounded-full px-5 py-2 font-semibold hover:bg-primary-700 transition">Find things to do</button>
          </div>
        </div>
      </div>
    </section>

    {/* Interest Cards */}
    <section className="w-full py-8">
      <div className="cards-container">
        <CardGrid cardType="interest" maxCards={4}>
          {['Outdoors', 'Food', 'Culture', 'Water'].map((interest, i) => (
            <InterestCard 
              key={interest}
              image={placeholder}
              title={interest}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Experiences Near Colombo */}
    <section className="w-full py-8">
      <div className="content-container">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Explore experiences near Colombo</h2>
        <CardGrid cardType="scroll" maxCards={6}>
          {[
            { title: 'Sigiriya Rock Fortress Day Trip', rating: 4.8, reviewCount: 1000, price: '$99' },
            { title: 'Elephant Orphanage & Spice Garden Tour', rating: 4.6, reviewCount: 850, price: '$75' },
            { title: 'Galle Fort & Southern Coast Tour', rating: 4.9, reviewCount: 1200, price: '$120' },
            { title: 'Tea Plantation & Kandy City Tour', rating: 4.7, reviewCount: 950, price: '$85' },
            { title: 'Whale Watching in Mirissa', rating: 4.5, reviewCount: 600, price: '$65' },
            { title: 'Colombo City Walking Tour', rating: 4.4, reviewCount: 400, price: '$45' }
          ].map((experience, i) => (
            <ExperienceCard 
              key={i}
              image={placeholder}
              title={experience.title}
              rating={experience.rating}
              reviewCount={experience.reviewCount}
              price={experience.price}
              className="min-w-[260px] flex-shrink-0"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Inspiration Section */}
    <section className="w-full py-8">
      <div className="content-container">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Inspiration to get you going</h2>
        <CardGrid cardType="scroll" maxCards={5}>
          {[
            'Best beaches in Sri Lanka',
            'Ancient temples and culture',
            'Wildlife safari adventures',
            'Mountain hiking trails',
            'Local food experiences'
          ].map((inspiration, i) => (
            <InspirationCard 
              key={i}
              image={placeholder}
              title={inspiration}
              className="min-w-[260px] flex-shrink-0"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Things to do right now */}
    {/* Things to do right now */}
    <section className="w-full py-8">
      <div className="content-container">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Things to do—right now</h2>
        <CardGrid cardType="scroll" maxCards={6}>
          {[
            'Sunset at Galle Face Green',
            'Visit Gangaramaya Temple',
            'Shopping at Pettah Market',
            'Colombo National Museum',
            'Viharamahadevi Park stroll',
            'Street food tour in Fort'
          ].map((activity, i) => (
            <InspirationCard 
              key={i}
              image={placeholder}
              title={activity}
              className="min-w-[260px] flex-shrink-0"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Sponsored Section */}
    <section className="w-full py-8">
      <div className="page-container">
        <div className="bg-white rounded-2xl shadow border border-gray-200 flex items-center p-4">
          <img src={avatar} alt="Sponsored" className="w-20 h-20 object-cover rounded-xl mr-4" />
          <div>
            <div className="text-xs text-gray-500 mb-1">Sponsored by CSHAP</div>
            <div className="font-bold text-gray-900 mb-1">Adventure is better with your pup</div>
            <div className="text-gray-700 text-sm mb-2">Traveling with your dog? Get all your USA pet-friendly stays, tips, and more with USA.Hotels.com. Start planning your perfect getaway together.</div>
            <button className="bg-primary-600 text-white rounded-full px-5 py-2 font-semibold hover:bg-primary-700 transition">Learn more</button>
          </div>
        </div>
      </div>
    </section>

    {/* Iconic places */}
    <section className="w-full py-8">
      <div className="content-container">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Iconic places you need to see</h2>
        <CardGrid cardType="place" maxCards={6}>
          {['Rome, Italy', 'Paris, France', 'Las Vegas, NV', 'Reykjavik, Iceland', 'Tokyo, Japan', 'Sydney, Australia'].map((place) => (
            <PlaceCard 
              key={place}
              image={placeholder}
              title={place}
              className="w-full max-w-[180px]"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Themed collections */}
    <section className="w-full py-8">
      <div className="content-container">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Browse themed collections</h2>
        <CardGrid cardType="collection" maxCards={5}>
          {[
            'Pizza, Roman style',
            'Get right to the reef',
            'Take a grand detour',
            'London, after dark',
            'Island hopping adventures'
          ].map((collection) => (
            <CollectionCard 
              key={collection}
              image={placeholder}
              title={collection}
              className="w-full max-w-[220px]"
            />
          ))}
        </CardGrid>
      </div>
    </section>

    {/* Awards Section */}
    <section className="w-full bg-primary-800 py-16">
      <div className="content-container flex items-center">
        <div className="flex-1">
          <div className="text-yellow-400 text-lg font-bold mb-2">Travelers' Choice Awards Best of the Best</div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Among the top 10% of <br />
            hotels, attractions, and <br />
            restaurants—decided by <br />
            you.
          </h2>
          <button className="bg-white text-primary-800 rounded-full px-6 py-2 font-semibold hover:bg-gray-100 transition">
            See winners
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <img src={placeholder} alt="Award" className="w-80 h-80 object-cover rounded-full" />
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="w-full bg-white py-8 border-t border-gray-200">
      <div className="footer-container">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">About IslandHop</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">About us</a></li>
              <li><a href="#" className="hover:text-gray-900">Press</a></li>
              <li><a href="#" className="hover:text-gray-900">Resources and Policies</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Write a review</a></li>
              <li><a href="#" className="hover:text-gray-900">Add a place</a></li>
              <li><a href="#" className="hover:text-gray-900">Join</a></li>
              <li><a href="#" className="hover:text-gray-900">Travelers' Choice</a></li>
              <li><a href="#" className="hover:text-gray-900">GreenLeaders</a></li>
              <li><a href="#" className="hover:text-gray-900">Help Centre</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Do Business With Us</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Owners</a></li>
              <li><a href="#" className="hover:text-gray-900">Business Advantage</a></li>
              <li><a href="#" className="hover:text-gray-900">Sponsored Placements</a></li>
              <li><a href="#" className="hover:text-gray-900">Access our Content API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">IslandHop Sites</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Book tours and attraction tickets on Viator</a></li>
              <li><a href="#" className="hover:text-gray-900">Reserve dining at your favorite restaurants</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <img src="/logo192.png" alt="IslandHop" className="h-8 w-8" />
              <div className="text-sm text-gray-600">
                © 2025 IslandHop LLC All rights reserved.
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Terms of Use</a>
              <a href="#" className="hover:text-gray-900">Privacy and Cookie Statement</a>
              <a href="#" className="hover:text-gray-900">Cookie consent</a>
              <a href="#" className="hover:text-gray-900">Site Map</a>
              <a href="#" className="hover:text-gray-900">How the site works</a>
              <a href="#" className="hover:text-gray-900">Contact us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage;