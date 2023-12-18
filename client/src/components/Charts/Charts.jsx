import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import api from "../../api/RestApi";
import axios from "axios";
import DatePicker from "react-datepicker";
import { useCookies } from "react-cookie";
import NotFound from "../NotFound";
import 'react-datepicker/dist/react-datepicker.css';

const BarChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [ageFilter, setAgeFilter] = useState(null);
  const [genderFilter, setGenderFilter] = useState(null);
  const [cookies, setCookie] = useCookies(["ageFilter", "genderFilter"]);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(new Date("2022-10-03"));
  const [endDate, setEndDate] = useState(new Date("2022-10-28"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(api);
        setData(response.data.data);
        console.log(response.data.data);

        // initial filter values from cookies
        setAgeFilter(cookies.ageFilter || null);
        setGenderFilter(cookies.genderFilter || null);
      } catch (err) {
        setError(true);
        console.error("Server not found!", err.message);
      }
    };

    fetchData(); // Calling fetchData
  }, []);

  const setPreferencesAsCookies = () => {
    setCookie("ageFilter", ageFilter, { path: "/" });
    setCookie("genderFilter", genderFilter, { path: "/" });
  };

  useEffect(() => {
    setPreferencesAsCookies();
  }, [ageFilter, genderFilter]);

  useEffect(() => {
    const filtered = data?.filter((entry) => {
      if (ageFilter && entry.Age !== ageFilter) return false;
      if (genderFilter && entry.Gender !== genderFilter) return false;
      return true;
    });

    setFilteredData(filtered);
  }, [data, ageFilter, genderFilter]);

  if (filteredData && filteredData?.length === 0) {
    console.error("No data available for the chart.");
    return null;
  }

  const features =
    filteredData &&
    Object.keys(filteredData[0]).filter(
      (key) => key !== "Day" && key !== "Age" && key !== "Gender"
    );

  if (features?.length === 0) {
    console.error("No features found in the filtered data.");
    return null;
  }

  const categories = [
    ...new Set(filteredData.map((entry) => `${entry.Age}, ${entry.Gender}`)),
  ];

  const transposedData = categories?.map((category) => {
    const age = category.split(",")[0].trim();
    const gender = category.split(",")[1].trim();

    return {
      age,
      gender,
      data: features?.map(
        (feature) =>
          filteredData.find(
            (entry) => entry.Age === age && entry.Gender === gender
          )[feature]
      ),
    };
  });

  console.log(transposedData, "hey");

  const options = {
    chart: {
      type: "bar",
      height: 400,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: features,
    },
    title: {
      text: "Following chart",
    },
  };

  const handleAgeFilterChange = (event) => {
    setAgeFilter(event.target.value);
  };

  const handleGenderFilterChange = (event) => {
    const selectedGender = event.target.value.toLowerCase();
    const capitalizedGender =
      selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1);
    setGenderFilter(capitalizedGender);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <div className="charts__body">
      <div className="px-2">
        <label>
          Age Filter:
          <select
            value={ageFilter || ""}
            onChange={handleAgeFilterChange}
            className="border border-gray-300 rounded-md mx-2"
          >
            <option value="">All</option>
            <option value="15-25">15-25</option>
            <option value=">25">25</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Gender Filter:
          <select
            value={genderFilter || ""}
            onChange={handleGenderFilterChange}
            className="border border-gray-300 rounded-md mx-2"
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
      </div>
      <div className="">
        Date Range:
        <div className="flex">
          <div>
        Start Date:
          </div>
          <div>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          placeholderText="Start Date"
        />
        </div>
        </div>
        <div className="flex">
          <div>End Date:</div>
          <div>
            <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          placeholderText="End Date"
        />
        </div>
        </div>
      </div>
      <div className="py-5 flex flex-col gap-5">
        <div>
          <h1 className="text-lg font-bold font-serif bg-gray-500 text-center">
            Bar chart
          </h1>
          {data ? (
            <Chart
              options={options}
              series={transposedData}
              type="bar"
              height={400}
            />
          ) : (
            <NotFound error={error} />
          )}
        </div>
        <div>
          <h1 className="text-lg font-bold font-serif bg-gray-500 text-center">
            Line chart
          </h1>
          <LineChart data={transposedData} />
        </div>
      </div>
    </div>
  );
};

const LineChart = ({ data }) => {
  const categories = data?.map((entry) => `${entry.age}, ${entry.gender}`);
  const series = data?.map((entry) => ({
    name: `${entry.age}, ${entry.gender}`,
    data: entry.data.map((val) => parseFloat(val)),
  }));

  const options = {
    chart: {
      type: "line",
      height: 400,
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: categories,
    },
    title: {
      text: "Line Chart - Time Spent by Age and Gender",
    },
  };

  return (
    <>
      {data && (
        <Chart options={options} series={series} type="line" height={400} />
      )}
      ;
    </>
  );
};

export default BarChart;
