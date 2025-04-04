import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface MobileCameraInterfaceProps {
  onTakePhoto: () => void;
  onScan: () => void;
  onAddTag: () => void;
  onExit: () => void;
}

const MobileCameraInterface: React.FC<MobileCameraInterfaceProps> = ({
  onTakePhoto,
  onScan,
  onAddTag,
  onExit
}) => {
  return (
    <View style={styles.container}>
      {/* Top controls */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.topButton} onPress={onExit}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
        
        <View style={styles.topRightControls}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="refresh-cw" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onExit}>
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Zoom controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton}>
          <Text style={styles.zoomButtonText}>.6x</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.zoomButton, styles.activeZoomButton]}>
          <Text style={[styles.zoomButtonText, styles.activeZoomButtonText]}>1x</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.bottomButton} onPress={onScan}>
          <View style={styles.bottomButtonIcon}>
            <Feather name="image" size={24} color="white" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.captureButton} onPress={onTakePhoto}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomButton} onPress={onAddTag}>
          <View style={styles.bottomButtonIcon}>
            <Feather name="tag" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Mode selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity style={styles.modeButton}>
          <Text style={styles.modeButtonText}>SCAN</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.modeButton, styles.activeModeButton]}>
          <Text style={[styles.modeButtonText, styles.activeModeButtonText]}>PHOTO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.modeButton}>
          <Text style={styles.modeButtonText}>VIDEO</Text>
        </TouchableOpacity>
      </View>
      
      {/* Navigation dots */}
      <View style={styles.navDots}>
        <View style={styles.navDot} />
        <View style={styles.navDot} />
        <View style={styles.navDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between',
    position: 'relative',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topButton: {
    padding: 8,
  },
  doneText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topRightControls: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 200,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  zoomButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeZoomButton: {
    backgroundColor: '#4da6ff',
  },
  zoomButtonText: {
    color: 'white',
    fontSize: 14,
  },
  activeZoomButtonText: {
    fontWeight: 'bold',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  bottomButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#333',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeModeButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  modeButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeModeButtonText: {
    color: 'white',
  },
  navDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  navDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginHorizontal: 3,
  },
});

export default MobileCameraInterface;
