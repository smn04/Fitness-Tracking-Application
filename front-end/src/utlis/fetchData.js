export const ExerciseOptions = {
    method: "GET",
    url: "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
    headers: {
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      "X-RapidAPI-Key": "317222a0d1mshf0085b044402428p17ca72jsnc92abacb59f7",
    },
  };
  
  export const youtubeSearchOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
      "X-RapidAPI-Key": "0e59ce87c9msh7da6b62c2608e32p1cd382jsnaaa44031ce21",
    },
  };
  export const FetchData = async (url, options) => {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data);
    return data;
  };
  