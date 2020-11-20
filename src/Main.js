import React ,{useEffect , useState, useRef} from 'react';
import {SafeAreaView, FlatList, View , Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Axios from 'axios';

import {mapStyle} from './styles';
import {City, RestaurantDetail, SearchBar} from './components';

let originalList = [];

const Main = () => {
  const [modalFlag, setModalFlag] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const mapRef = useRef(null);

  const fetchCities = async () => {
    const {data}=await Axios.get('https://opentable.herokuapp.com/api/cities') ;
    setCityList(data.cities);
    originalList = [...data.cities];
  }

  const onCitySearch = (text) => {
    const filteredList = originalList.filter(item => {
      const userText = text.toUpperCase();
      const cityName = item.toUpperCase();

      return cityName.indexOf(userText) > -1 ;
    })
    setCityList(filteredList)
  }

  const onCitySelect = async (city) => {
    const {
      data: {restaurants},
    } = await Axios.get(
      'https://opentable.herokuapp.com/api/restaurants?city=' + city,
    );
    setRestaurants(restaurants);

    const restaurantsCoordinates = restaurants.map((res) => {
      return {
        latitude: res.lat,
        longitude: res.lng,
      };
    });
    mapRef.current.fitToCoordinates(restaurantsCoordinates, {
      // alttaki kısım haritanınyerini ayarlamak için
      edgePadding: {
        top: 25,
        right: 25,
        bottom: 25,
        left: 25,
      },
    });

  };

  const onRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setModalFlag(true)
  }
 

    useEffect(() => {
     fetchCities();
    }, [])

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        {/* <Text>Main</Text> */}
        <MapView
          customMapStyle={mapStyle}
          // bu şkilde haritaya stil verilebiliyor. internette bir sürü örneği var. biz bu projede deneme amaçlı birşeyler kopyaladık
          ref={mapRef}
          style={{flex: 1}}
          //flex yazmayınca gözükmedi.
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
            {restaurants.map((r, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: r.lat,
                longitude: r.lng,
              }}
              onPress={() => onRestaurantSelect(r)}
            />
          ))}
        </MapView>
        <View style={{position : "absolute"}}>
          <SearchBar onSearch={onCitySearch} />
          <FlatList
            showsHorizontalScrollIndicator={false}
            //bu şekilde alttaki kayan çizgi kaybolur
            horizontal
            // bu şekilde listeyi yan şekilde göstermiş oluruz
            keyExtractor={(item,index) => index.toString()}
            data={cityList}
            renderItem={({item}) => <City cityName={item} onSelect={() => onCitySelect(item)} />}

          />
           <RestaurantDetail
            isVisible={modalFlag}
            restaurant={selectedRestaurant}
            onClose={() => setModalFlag(false)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Main;
