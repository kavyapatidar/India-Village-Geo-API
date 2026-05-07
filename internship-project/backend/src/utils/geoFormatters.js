function formatAddress(parts) {
  return [
    parts.villageName,
    parts.subDistrictName,
    parts.districtName,
    parts.stateName,
    parts.countryName
  ]
    .filter(Boolean)
    .join(", ");
}

function formatVillage(village) {
  const state = village.subDistrict.district.state;
  const district = village.subDistrict.district;
  const subDistrict = village.subDistrict;

  return {
    id: village.id,
    code: village.villageCode,
    name: village.name,
    stateCode: state.stateCode,
    districtCode: district.districtCode,
    subDistrictCode: subDistrict.subDistrictCode,
    standardizedAddress: formatAddress({
      villageName: village.name,
      subDistrictName: subDistrict.name,
      districtName: district.name,
      stateName: state.name,
      countryName: state.country?.name
    })
  };
}

module.exports = {
  formatAddress,
  formatVillage
};
