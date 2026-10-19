import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
  showMenu?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
};

export default function Header({
  showMenu = true,
  showProfile = true,
  onMenuPress,
  onProfilePress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.left}>
          {showMenu && (
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
              <Ionicons name="menu" size={34} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <Text style={styles.logoAP}>A&P </Text>
          <Text style={styles.logoSenac}>SENAC</Text>
        </View>

        {showProfile && (
          <TouchableOpacity onPress={onProfilePress} style={styles.avatar}>
            <Ionicons name="person-outline" size={32} color="#1A1A1A" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7941D',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },
  content: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 12,
  },
  logoAP: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: '#1A1A1A',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logoSenac: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B3C7A',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});