import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HeaderProps = {
  showMenu?: boolean;
  showProfile?: boolean;
};

export default function Header(_props: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.texto}>Achados e Perdidos do SENAC</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00549A',
  },

  content: {
    height: 56,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  texto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});