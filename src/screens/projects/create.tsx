import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import CreateProjectModal from '../../components/CreateProjectModal';
import ContentWrapper from '../../components/ContentWrapper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CreateProjectScreen = () => {
  console.log('CreateProjectScreen: Component rendering');
  const navigation = useNavigation<NavigationProp>();

  const handleClose = () => {
    console.log('CreateProjectScreen: Closing modal');
    navigation.goBack();
  };

  const handleSuccess = () => {
    console.log('CreateProjectScreen: Project created successfully');
    navigation.navigate('ProjectsTab');
  };

  return (
    <ContentWrapper>
      <View style={styles.container}>
        <CreateProjectModal
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default CreateProjectScreen;
