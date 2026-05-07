# Dataset Understanding

## 1. What Is This Dataset?

This dataset contains village-level geographical data of India.

The data is arranged in a hierarchy. This means the smaller places belong to bigger places.

The hierarchy is:

`Country -> State -> District -> Sub-District -> Village`

For this project, the dataset helps us build a system that can return clean address data through APIs.

## 2. File Structure Observation

The zip file contains separate files for different states and union territories.

Examples:

- `Rdir_2011_27_MAHARASHTRA.xls`
- `Rdir_2011_29_KARNATAKA.xls`
- `Rdir_2011_10_BIHAR.xls`

This means the raw data is already divided state-wise, which is helpful during import.

## 3. Columns In The Dataset

From the Maharashtra file, the main columns are:

- `MDDS STC`
- `STATE NAME`
- `MDDS DTC`
- `DISTRICT NAME`
- `MDDS Sub_DT`
- `SUB-DISTRICT NAME`
- `MDDS PLCN`
- `Area Name`

## 4. Meaning Of Each Column

### `MDDS STC`

This is the state code.

Example: `27` means Maharashtra.

### `STATE NAME`

This is the name of the state.

Example: `MAHARASHTRA`

### `MDDS DTC`

This is the district code.

Example: `497`

### `DISTRICT NAME`

This is the district name.

Example: `Nandurbar`

### `MDDS Sub_DT`

This is the sub-district code.

Example: `03950`

### `SUB-DISTRICT NAME`

This is the sub-district name.

Example: `Akkalkuwa`

### `MDDS PLCN`

This is the place code. In many rows, this looks like the village or locality code.

Example: `525002`

### `Area Name`

This is the village or locality name.

Example: `Manibeli`

## 5. Example Row Explanation

Example row:

`27 | MAHARASHTRA | 497 | Nandurbar | 03950 | Akkalkuwa | 525002 | Manibeli`

This means:

- State code = `27`
- State name = `Maharashtra`
- District code = `497`
- District name = `Nandurbar`
- Sub-district code = `03950`
- Sub-district name = `Akkalkuwa`
- Village code = `525002`
- Village name = `Manibeli`

So in simple words:

`Manibeli` is a village in `Akkalkuwa`, which is in `Nandurbar`, which is in `Maharashtra`, in `India`.

## 6. Important Data Pattern

Not every row is a final village row.

Some rows represent higher levels of the hierarchy.

Example:

- `000` district code
- `00000` sub-district code
- `000000` place code

These rows seem to represent summary or parent-level entries such as state-level, district-level, or sub-district-level records.

So while importing data, we should not assume every row is a real village record.

## 7. Problem Statement Based On This Dataset

Many businesses and digital platforms need accurate and standardized village-level geographical data for India. However, the raw data is large, hierarchical, and not easy to use directly from spreadsheet files. This creates problems in search, dropdowns, address forms, and data consistency. Therefore, a centralized system is needed to clean, organize, store, and serve this data through APIs.

## 8. Why This Dataset Is Useful

This dataset is useful because it gives:

- official-looking codes
- names for each hierarchy level
- a clear parent-child structure
- enough information to build search and filter APIs

## 9. Challenges I May Face

- Some rows are hierarchy rows, not village rows
- Data may contain duplicates or repeated parents
- Codes must be preserved correctly
- Importing all files together will need careful validation
- The same naming style may not be perfectly consistent everywhere

## 10. My Current Understanding

This dataset is the raw input of the whole project.

The main job is not only storing the data, but also converting it into a clean database structure that can be searched quickly and used safely by other applications.
