import { logout } from '@/src/services/auth';
import { useAppTheme } from '@/src/theme/useTheme';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';



export default function settings() {

  const {colors,mode,toggleTheme} = useAppTheme();

  const handleLogout = async () => {

    try {
      await logout();
      router.replace("/(auth)/login")
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View className='flex-1 justify-center p-6'>
      <Text className='text-center text-xl'>Ayarlar</Text>
      <Pressable
        onPress={handleLogout}
        style={{
          marginTop: 20,
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: colors.primaryForeground }}>Çıkış Yap</Text>
      </Pressable>
    </View>
  )
}

