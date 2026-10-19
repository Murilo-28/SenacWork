
import { StyleSheet, Text, View } from 'react-native';

type HeaderProps = {
  showMenu?: boolean;
  showProfile?: boolean;
};

export default function Header({
  showMenu = true,
  showProfile = true,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>
        Achados e Perdidos do SENAC
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00549A',
    padding: 20,
    alignItems: 'center',
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});