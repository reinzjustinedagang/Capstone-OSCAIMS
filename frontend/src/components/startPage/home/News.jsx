import React from "react";

const newsArticles = [
  // {
  //   id: 1,
  //   imageUrl: "https://placehold.co/300x200/cccccc/333333?text=Press+Release",
  //   pressRelease: true,
  //   title: "Expanded Centenarians Act Cash Benefits | Ano B...",
  //   date: "Dec 2, 2024",
  //   snippet:
  //     "Simula sa Enero 2025, ang National Commission of Senior Citizens (NCSC) ay magpapatupad ng mga batas...",
  //   views: "121,563",
  //   likes: "2,329",
  // },
  // {
  //   id: 2,
  //   imageUrl:
  //     "https://placehold.co/300x200/cccccc/333333?text=NCSC+NEWS+HIGHLIGHT",
  //   pressRelease: true,
  //   title: "NCSC Releases Over 1 Billion Cash Gifts for...",
  //   date: "6 days ago",
  //   snippet:
  //     "The National Commission of Senior Citizens (NCSC) has successfully disbursed over ₱1 billion worth of cash gifts to...",
  //   views: "35,719",
  //   likes: "102",
  // },
  // {
  //   id: 3,
  //   imageUrl:
  //     "https://placehold.co/300x200/cccccc/333333?text=NCSC+NEWS+HIGHLIGHT",
  //   pressRelease: false,
  //   title: "NCSC, Sen. Lacson Strengthen Push for...",
  //   date: "6 days ago",
  //   snippet:
  //     "August 12, 2025 - Senate of the Philippines—The National Commission of Senior Citizens (NCSC), led by Chairperson and...",
  //   views: "849",
  //   likes: "40",
  // },
  // {
  //   id: 4,
  //   imageUrl: "https://placehold.co/300x200/cccccc/333333?text=NCSC+NEWS+WORKS",
  //   pressRelease: false,
  //   title: "NCSC, DICT Launch Digital National Senior...",
  //   date: "6 days ago",
  //   snippet:
  //     "The National Commission of Senior Citizens (NCSC) and the Department of Information and Communications Technology...",
  //   views: "36,950",
  //   likes: "234",
  // },
];

// The main LatestNews component
const News = () => {
  return (
    <div className="bg-white p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 ">
          Latest News
        </h2>
      </div>

      {/* Articles or No Events */}
      {newsArticles.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-2xl font-semibold mb-4">No events posted</p>
          <p>Check back later for the latest news and updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsArticles.map((article) => (
            <div
              key={article.id}
              className="bg-gray-100 rounded-xl shadow-md overflow-hidden flex flex-col h-full"
            >
              {/* Image & Press Release */}
              <div className="relative">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{article.date}</p>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base mb-4 line-clamp-3">
                    {article.snippet}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Links */}
      <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4 text-sm text-gray-700">
        <a href="#" className="underline hover:text-blue-700">
          Click here to read more news items...
        </a>
      </div>
    </div>
  );
};

export default News;
