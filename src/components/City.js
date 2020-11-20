import React from 'react' ; 
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native' ;
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { cityStyle } from '../styles';

import {} from '../styles';

const City = (props) => {
    return (
        <TouchableOpacity style={cityStyle.container}
            onPress={props.onSelect}
        >
            <Icon name='home-city-outline' size={20} color='#424242' />
            <Text style={cityStyle.text}>{props.cityName}</Text>
        </TouchableOpacity>
    )
}

export {City}

