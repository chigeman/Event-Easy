import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  'Educational/Academic Events',
  'Social & Cultural Events',
  'Sports & Recreational Events',
  'Entertainment Events',
  'Professional & Educational Events',
  'Religious',
];

const AttendeePage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/Event-Easy/Event/events')
      .then((res) => res.json())
      .then((data) => {
        const approvedEvents = data.filter(event => event.status === 'approved');
        setEvents(approvedEvents);
        setFilteredEvents(approvedEvents);
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredEvents(category === 'All' ? events : events.filter(e => e.category === category));
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 via-white to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-10 px-6 flex justify-center items-start">
      <div className="max-w-5xl w-full space-y-8">

        {/* Category Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-4">🎯 Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {['All', ...categories].map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(category)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border shadow-sm ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards */}
        {filteredEvents.map((event) => {
          const organizerName = event.organizer?.name || "Unknown Organizer";
          const organizerImage = event.organizerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(organizerName)}`;

          return (
            <div
              key={event._id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 space-y-5 transition-transform transform hover:scale-[1.01] hover:shadow-2xl"
            >
              <h4 className="text-gray-600 dark:text-gray-400 text-md font-semibold">Organizer Info</h4>
              <div className="flex items-center gap-4">
                <img
                  src={organizerImage}
                  alt="Organizer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                />
                <div>
                    <p className="font-bold text-xl text-gray-900 dark:text-white">
                        {event.organizer?.name || "Unknown Organizer"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.time).toLocaleString()}</p>
                </div>
              </div>

              {/* Event Content */}
              <div className="flex flex-col gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">{event.title}</h2>
                  <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {(event.imageUrl?.url || event.videoUrl?.url) && (
                  <div className="w-full flex items-right gap-3 md:flex-row flex-col">
                    {event.imageUrl?.url && (
                      <img
                        src={event.imageUrl.url}
                        alt="Event"
                        className="rounded-xl w-full h-72 object-cover border m-3"
                      />
                    )}
                    {event.videoUrl?.url && (
                      <video controls className="rounded-xl w-full h-72 object-cover border m-3">
                        <source src={event.videoUrl.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
              </div>

              {/* Reactions */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t dark:border-gray-700">
                <div className="flex gap-6 text-xl">
                  <Link
                    to={`/attend/${event._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium mt-4 inline-block"
                    title="View Details"
                  >
                    Attend
                  </Link>
                </div>
                <span className="font-medium text-yellow-500">Rating: ⭐⭐⭐⭐☆</span>
              </div>

              {/* Comments */}
              <div className="pt-3">
                <h4 className="text-indigo-600 dark:text-indigo-300 font-semibold">💬 Comments</h4>
                {event.comments?.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {event.comments.map((comment, index) => (
                      <div key={index} className="bg-indigo-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-800 dark:text-white text-sm">{comment.text}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-300 block">{comment.author}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-gray-500 dark:text-gray-400 mt-2">No comments yet</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendeePage;