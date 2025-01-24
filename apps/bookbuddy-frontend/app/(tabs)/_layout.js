import React from 'react';
import { Tabs } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



export default function AppLayout() {
    return (
            <Tabs screenOptions={{ headerShown: false }}> 
                <Tabs.Screen 
                    name="(search)"
                    options={{
                        title: 'Search', 
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="search" color={color} size={size} />
                        ),
                    }} 
                />
                <Tabs.Screen 
                    name="(home)" 
                    options={{
                        title: 'Home', 
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="home" color={color} size={size} />
                        ),
                    }} 
                />
                <Tabs.Screen 
                    name="(profile)" 
                    options={{
                        title: 'Profile', 
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="person" color={color} size={size} />
                        ),
                    }} 
                />
                <Tabs.Screen 
                    name="chatbot/index" 
                    options={{
                        href: null,

                    }}
                    
                />
            </Tabs>
    );
}
