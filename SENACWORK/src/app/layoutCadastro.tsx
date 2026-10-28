import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.left}>
          {showMenu && (
            <Pressable
              onPress={onMenuPress}
              style={styles.botaoIcone}
              hitSlop={8}
            >
              <Ionicons name="menu" size={26} color="#0F1B2D" />
            </Pressable>
          )}

          <Text style={styles.logo}>
            A&P <Text style={styles.senac}>SENAC</Text>
          </Text>
        </View>

        {showProfile && (
          <Pressable
            onPress={onProfilePress}
            style={[styles.botaoIcone, styles.avatar]}
            hitSlop={8}
          >
            <Ionicons name="person-outline" size={20} color="#00549A" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F7FB',
  },

  content: {
    height: 56,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  botaoIcone: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#0F1B2D',
  },

  senac: {
    color: '#00549A',
  },

  avatar: {
    borderRadius: 20,
    backgroundColor: '#E6F0FA',
  },
});