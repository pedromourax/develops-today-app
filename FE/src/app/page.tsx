"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Search } from "lucide-react";
import { ColorRing } from "react-loader-spinner";

interface Country {
  name: string;
  code: string;
  flag: string;
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("response");

    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/country-info/available-countries`,
          { method: "GET" }
        );
        const data = await response.json();
        setIsLoading(false);
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex items-center">
          <Globe className="mr-2" />
          <h1 className="text-2xl font-bold">Country Information App</h1>
        </div>
      </header>
      <main className="container mx-auto mt-8 px-4">
        <h2 className="text-3xl font-semibold mb-6">Countries List</h2>
        <div className="items-center justify-center flex gap-2 w-full mb-4">
          <Search />
          <input
            type="text"
            placeholder="Search country..."
            className="p-2 text-xl font-bold focus:outline-none border-none bg-transparent w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {!isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filteredCountries.map((country) => (
              <Link href={`/country/${country.code}`} key={country.code}>
                <div className="bg-white flex gap-2 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                  {country.flag && <img src={country.flag} className="w-10" />}
                  <h3 className="text-xl font-medium text-blue-600">
                    {country.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-full py-20 w-full flex items-center justify-center">
            <ColorRing
              visible={true}
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#000", "#000", "#000", "#000", "#000"]}
            />
          </div>
        )}
      </main>
    </div>
  );
}
