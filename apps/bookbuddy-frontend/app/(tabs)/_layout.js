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
                    name="stats"
                    options={{
                        title: 'Stats', 
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="bar-chart" color={color} size={size} />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="goals"
                    options={{
                        title: 'Goals', 
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="flag" color={color} size={size} />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="highlights"
                    options={{
                        title: 'Notes', 
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="highlight" color={color} size={size} />
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
