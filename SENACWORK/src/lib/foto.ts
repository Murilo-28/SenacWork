import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export type OrigemFoto = 'camera' | 'galeria';

export type ResultadoFoto =
  | { uri: string }
  | { cancelado: true }
  | { erro: string };

const opcoes: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.4,
};

export async function escolherFoto(
  origem: OrigemFoto
): Promise<ResultadoFoto> {
  try {
    // No navegador não existe permissão nativa: abre o seletor de arquivos
    if (Platform.OS === 'web') {
      const resultado = await ImagePicker.launchImageLibraryAsync(opcoes);
      return resultado.canceled
        ? { cancelado: true }
        : { uri: resultado.assets[0].uri };
    }

    const permissao =
      origem === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      return {
        erro:
          origem === 'camera'
            ? 'Permita o acesso à câmera nas configurações do celular.'
            : 'Permita o acesso à galeria nas configurações do celular.',
      };
    }

    const resultado =
      origem === 'camera'
        ? await ImagePicker.launchCameraAsync(opcoes)
        : await ImagePicker.launchImageLibraryAsync(opcoes);

    return resultado.canceled
      ? { cancelado: true }
      : { uri: resultado.assets[0].uri };
  } catch (erro) {
    console.log('Erro ao escolher foto:', erro);
    return { erro: 'Não foi possível abrir a câmera ou a galeria.' };
  }
}