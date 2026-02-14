import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, radius, shadow, spacing, type } from '../../theme/tokens';


export default function AppLayout() {
    const insets = useSafeAreaInsets();

    const icon = (symbol, focused) => (
        <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
            <Text style={[styles.iconText, focused && styles.iconTextFocused]}>{symbol}</Text>
        </View>
    );

    return (
            <Tabs
                screenOptions={{
                    headerShown: false,
                    sceneStyle: { backgroundColor: palette.background },
                    tabBarStyle: [
                        styles.tabBar,
                        {
                            height: 62 + Math.max(insets.bottom, spacing.xs),
                            paddingBottom: Math.max(insets.bottom, spacing.xs),
                        },
                    ],
                    tabBarLabelStyle: styles.label,
                    tabBarActiveTintColor: palette.text,
                    tabBarInactiveTintColor: palette.textMuted,
                    tabBarHideOnKeyboard: true,
                }}
            > 
                <Tabs.Screen 
                    name="(search)"
                    options={{
                        title: 'Search', 
                        tabBarIcon: ({ focused }) => icon('⌕', focused),
                    }} 
                />
                <Tabs.Screen 
                    name="(home)" 
                    options={{
                        title: 'Home', 
                        tabBarIcon: ({ focused }) => icon('⌂', focused),
                    }} 
                />
                <Tabs.Screen 
                    name="stats/index"
                    options={{
                        title: 'Stats', 
                        tabBarIcon: ({ focused }) => icon('◔', focused),
                    }}
                />
                <Tabs.Screen 
                    name="goals/index"
                    options={{
                        title: 'Goals', 
                        tabBarIcon: ({ focused }) => icon('◎', focused),
                    }}
                />
                <Tabs.Screen 
                    name="highlights/index"
                    options={{
                        title: 'Notes', 
                        tabBarIcon: ({ focused }) => icon('✦', focused),
                    }}
                />
                <Tabs.Screen 
                    name="(profile)" 
                    options={{
                        title: 'Profile', 
                        tabBarIcon: ({ focused }) => icon('◯', focused),
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

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: spacing.md,
        marginHorizontal: spacing.md,
        height: 72,
        borderRadius: 24,
        borderTopWidth: 0,
        backgroundColor: palette.surface,
        paddingBottom: spacing.xs,
        paddingTop: spacing.xs,
        ...shadow,
    },
    label: {
        fontSize: 12,
        fontFamily: type.emphasis,
    },
    iconWrap: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapFocused: {
        backgroundColor: palette.primarySoft,
    },
    iconText: {
        fontSize: 13,
        color: palette.textMuted,
        fontFamily: type.emphasis,
    },
    iconTextFocused: {
        color: palette.primary,
    },
});
