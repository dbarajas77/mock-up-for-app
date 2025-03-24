import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import CreateProjectModal from '../../components/CreateProjectModal';
import ContentWrapper from '../../components/ContentWrapper';

type CreateProjectScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CreateProjectScreen = () => {
  console.log('CreateProjectScreen: Component rendering');
  const navigation = useNavigation<CreateProjectScreenNavigationProp>();

  const handleClose = () => {
    console.log('CreateProjectScreen: Closing modal');
    navigation.goBack();
  };

  const handleSuccess = () => {
    console.log('CreateProjectScreen: Project created successfully');
    navigation.navigate('Projects');
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
