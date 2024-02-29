//fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[datasearchForm]");
const loadingScreen=document.querySelector(".loading-container");

const userInfoContainer=document.querySelector(".user-info-container");

//initiaaly  variable needs
let currentTab=userTab;
let API_KEY="0a02c902513bee033fe70aeda04e6b74";
currentTab.classList.add("current-tab");

//yadi longitude v latitude access hai to starting men ek function call hogi
getfromSessionStorage();
//switch tab function
function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
            //if search form container is invisible so make it visible
        if (!searchForm.classList.contains("active")) {
            //your weather delete kr denge
            userInfoContainer.classList.remove("active");
            //grnat access ko remove kr denge
            grantAccessContainer.classList.remove("active");
            //searchform vali class list ko add kr denge
            searchForm.classList.add("active");
        }
        else{//main pahle search  vale tab pr tha ab your weather vale ko visible krna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab mein your weather vale tab men aa gaya hu to your weather vale function call kr denge
            getfromSessionStorage();

        }
    }


}


//when click on user tab
userTab.addEventListener('click',()=>{
    //pass click tab as input parameter
    switchTab(userTab);
})
//when click on search tab
searchTab.addEventListener('click',()=>{
    //pass click tab as input parameter
    switchTab(searchTab);
})
//check if coordinates are present in session storage
function getfromSessionStorage(){
    const localcoordinates=sessionStorage.getItem("user-coordinates");
    if (!localcoordinates) {
        //agar local coordinates nhi milen to grant location access ko visible krnege
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localcoordinates);
        fetchUserWeatherInfo(coordinates);
    }


}

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;

    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    
    }
    catch(e){
        loadingScreen.classList.remove("active");
        console.log("Error 404");
    }


}

function renderWeatherInfo(weatherInfo){
    //firstly we fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    
    //fetch values from weather info and put it UI element

    cityName.innerText=weatherInfo?.name;
    //for print country flag according to location
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText=weatherInfo?.weather?.[0]?.description;

    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;

}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("location access is not supported");
    }
}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }


})

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data= await response.json();
        loadingScreen.classList.remove("active");
        
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        
    }
    catch(e){
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        console.log("Error 404 ");

    }



}