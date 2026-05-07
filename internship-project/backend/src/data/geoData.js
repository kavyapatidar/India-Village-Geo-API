const geoData = {
  country: {
    id: 1,
    code: "IND",
    name: "India"
  },
  states: [
    { id: 1, code: "27", name: "Maharashtra" },
    { id: 2, code: "29", name: "Karnataka" },
    { id: 3, code: "10", name: "Bihar" }
  ],
  districts: [
    { id: 1, stateCode: "27", code: "497", name: "Nandurbar" },
    { id: 2, stateCode: "27", code: "500", name: "Nashik" },
    { id: 3, stateCode: "29", code: "533", name: "Bengaluru Urban" },
    { id: 4, stateCode: "10", code: "191", name: "Patna" }
  ],
  subDistricts: [
    { id: 1, districtCode: "497", code: "03950", name: "Akkalkuwa" },
    { id: 2, districtCode: "497", code: "03951", name: "Akrani" },
    { id: 3, districtCode: "500", code: "04120", name: "Nashik" },
    { id: 4, districtCode: "533", code: "05555", name: "Bengaluru North" },
    { id: 5, districtCode: "191", code: "01234", name: "Patna Rural" }
  ],
  villages: [
    {
      id: 1,
      stateCode: "27",
      districtCode: "497",
      subDistrictCode: "03950",
      code: "525002",
      name: "Manibeli"
    },
    {
      id: 2,
      stateCode: "27",
      districtCode: "497",
      subDistrictCode: "03950",
      code: "525003",
      name: "Dhankhedi"
    },
    {
      id: 3,
      stateCode: "27",
      districtCode: "497",
      subDistrictCode: "03950",
      code: "525004",
      name: "Chimalkhadi"
    },
    {
      id: 4,
      stateCode: "27",
      districtCode: "497",
      subDistrictCode: "03950",
      code: "525005",
      name: "Sinduri"
    },
    {
      id: 5,
      stateCode: "27",
      districtCode: "497",
      subDistrictCode: "03951",
      code: "525120",
      name: "Kakadpada"
    },
    {
      id: 6,
      stateCode: "27",
      districtCode: "500",
      subDistrictCode: "04120",
      code: "600101",
      name: "Adgaon"
    },
    {
      id: 7,
      stateCode: "29",
      districtCode: "533",
      subDistrictCode: "05555",
      code: "700201",
      name: "Hebbal"
    },
    {
      id: 8,
      stateCode: "10",
      districtCode: "191",
      subDistrictCode: "01234",
      code: "800301",
      name: "Gopalpur"
    }
  ]
};

module.exports = geoData;
