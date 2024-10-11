"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ColorRing } from "react-loader-spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CountryInfo({ params }: any) {
  const countryCode = params.countryCode;
  const [country, setCountry] = useState<any>(null);
  const [borderCountries, setBorderCountries] = useState<any[]>([]);
  const [chartLabels, setChartLabels] = useState<any[]>([]);
  const [chartValues, setChartValues] = useState<any[]>([]);

  useEffect(() => {
    const fetchCountryData = async () => {
      if (countryCode) {
        try {
          const response = await fetch(
            `http://localhost:3000/country-info/${countryCode}`,
            { method: "GET" }
          );
          const data = await response.json();
          setCountry(data);

          if (data.borders) {
            setBorderCountries(data.borders);
          }

          const values = data.population.map((country: any) => country.value);
          setChartValues(values);
          console.log(data.borders);

          const labels = data.population.map((country: any) => country.year);
          setChartLabels(labels);
        } catch (error) {
          console.error("Error fetching country data:", error);
        }
      }
    };

    fetchCountryData();
  }, []);

  const formatPopulation = (number: string) => {
    return new Intl.NumberFormat("en-US").format(Number(number));
  };

  if (!country) {
    return (
      <div className="h-dvh w-full flex items-center justify-center">
        <ColorRing
          visible={true}
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={["#000", "#000", "#000", "#000", "#000"]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center  hover:underline">
            <ArrowLeft className="mr-2" />
            Back to Countries List
          </Link>
        </div>
      </header>
      <main className="container mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            {country.flag && (
              <Image
                src={country.flag}
                alt={`${country.commonName} flag`}
                width={80}
                height={60}
                className="mr-4"
              />
            )}
            <h1 className="text-3xl  font-bold">{country.commonName}</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Country Information
              </h2>

              {country.population ? (
                <p className="flex items-center mb-2">
                  <Users className="mr-2" />
                  {formatPopulation(
                    country.population[country.population.length - 1].value
                  )}
                </p>
              ) : (
                <p className="flex items-center mb-2">
                  No information available
                </p>
              )}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Border Countries</h3>
                <div className="flex flex-wrap gap-2">
                  {borderCountries.map((border) => (
                    <Link
                      href={`/country/${border.countryCode}`}
                      key={border.countryCode}
                    >
                      {border.flag ? (
                        <div className="flex gap-2 bg-gray-200 pl-1 pr-3 py-1 rounded-full text-sm hover:bg-gray-300 transition duration-300">
                          <img src={border.flag} className="w-8 rounded-full" />
                          {border.commonName}
                        </div>
                      ) : (
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition duration-300">
                          {border.commonName}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Population Over Time
              </h2>
              {country.population ? (
                <Line
                  className="max-h-[500px]"
                  data={{
                    labels: chartLabels,
                    datasets: [
                      {
                        label: "Population",
                        data: chartValues,
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                        fill: false,
                      },
                    ],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              ) : (
                <p className="flex items-center mb-2">
                  No information available
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
