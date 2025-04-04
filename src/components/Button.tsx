import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

// Specify exact Feather icon names for TypeScript
type FeatherIconName = 
  | 'activity' | 'airplay' | 'alert-circle' | 'alert-octagon' | 'alert-triangle'  
  | 'align-center' | 'align-justify' | 'align-left' | 'align-right' | 'anchor'  
  | 'aperture' | 'archive' | 'arrow-down' | 'arrow-down-circle' | 'arrow-down-left'  
  | 'arrow-down-right' | 'arrow-left' | 'arrow-left-circle' | 'arrow-right' | 'arrow-right-circle'  
  | 'arrow-up' | 'arrow-up-circle' | 'arrow-up-left' | 'arrow-up-right' | 'at-sign'  
  | 'award' | 'bar-chart' | 'bar-chart-2' | 'battery' | 'battery-charging'  
  | 'bell' | 'bell-off' | 'bluetooth' | 'bold' | 'book' | 'bookmark' | 'book-open'  
  | 'box' | 'briefcase' | 'calendar' | 'camera' | 'camera-off' | 'cast' | 'check'  
  | 'check-circle' | 'check-square' | 'chevron-down' | 'chevron-left' | 'chevron-right'  
  | 'chevron-up' | 'chevrons-down' | 'chevrons-left' | 'chevrons-right' | 'chevrons-up'  
  | 'chrome' | 'circle' | 'clipboard' | 'clock' | 'cloud' | 'cloud-drizzle'  
  | 'cloud-lightning' | 'cloud-off' | 'cloud-rain' | 'cloud-snow' | 'code'  
  | 'codepen' | 'codesandbox' | 'coffee' | 'columns' | 'command' | 'compass'  
  | 'copy' | 'corner-down-left' | 'corner-down-right' | 'corner-left-down'  
  | 'corner-left-up' | 'corner-right-down' | 'corner-right-up' | 'corner-up-left'  
  | 'corner-up-right' | 'cpu' | 'credit-card' | 'crop' | 'crosshair' | 'database'  
  | 'delete' | 'disc' | 'dollar-sign' | 'download' | 'download-cloud' | 'droplet'  
  | 'edit' | 'edit-2' | 'edit-3' | 'external-link' | 'eye' | 'eye-off' | 'facebook'  
  | 'fast-forward' | 'feather' | 'figma' | 'file' | 'file-minus' | 'file-plus'  
  | 'file-text' | 'film' | 'filter' | 'flag' | 'folder' | 'folder-minus'  
  | 'folder-plus' | 'framer' | 'frown' | 'gift' | 'git-branch' | 'git-commit'  
  | 'git-merge' | 'git-pull-request' | 'github' | 'gitlab' | 'globe' | 'grid'  
  | 'hard-drive' | 'hash' | 'headphones' | 'heart' | 'help-circle' | 'hexagon'  
  | 'home' | 'image' | 'inbox' | 'info' | 'instagram' | 'italic' | 'key' | 'layers'  
  | 'layout' | 'life-buoy' | 'link' | 'link-2' | 'linkedin' | 'list' | 'loader'  
  | 'lock' | 'log-in' | 'log-out' | 'mail' | 'map' | 'map-pin' | 'maximize'  
  | 'maximize-2' | 'meh' | 'menu' | 'message-circle' | 'message-square'  
  | 'mic' | 'mic-off' | 'minimize' | 'minimize-2' | 'minus' | 'minus-circle'  
  | 'minus-square' | 'monitor' | 'moon' | 'more-horizontal' | 'more-vertical'  
  | 'mouse-pointer' | 'move' | 'music' | 'navigation' | 'navigation-2' | 'octagon'  
  | 'package' | 'paperclip' | 'pause' | 'pause-circle' | 'pen-tool' | 'percent'  
  | 'phone' | 'phone-call' | 'phone-forwarded' | 'phone-incoming' | 'phone-missed'  
  | 'phone-off' | 'phone-outgoing' | 'pie-chart' | 'play' | 'play-circle' | 'plus'  
  | 'plus-circle' | 'plus-square' | 'pocket' | 'power' | 'printer' | 'radio'  
  | 'refresh-ccw' | 'refresh-cw' | 'repeat' | 'rewind' | 'rotate-ccw' | 'rotate-cw'  
  | 'rss' | 'save' | 'scissors' | 'search' | 'send' | 'server' | 'settings'  
  | 'share' | 'share-2' | 'shield' | 'shield-off' | 'shopping-bag' | 'shopping-cart'  
  | 'shuffle' | 'sidebar' | 'skip-back' | 'skip-forward' | 'slack' | 'slash'  
  | 'sliders' | 'smartphone' | 'smile' | 'speaker' | 'square' | 'star' | 'stop-circle'  
  | 'sun' | 'sunrise' | 'sunset' | 'tablet' | 'tag' | 'target' | 'terminal'  
  | 'thermometer' | 'thumbs-down' | 'thumbs-up' | 'toggle-left' | 'toggle-right'  
  | 'tool' | 'trash' | 'trash-2' | 'trello' | 'trending-down' | 'trending-up'  
  | 'triangle' | 'truck' | 'tv' | 'twitch' | 'twitter' | 'type' | 'umbrella'  
  | 'underline' | 'unlock' | 'upload' | 'upload-cloud' | 'user' | 'user-check'  
  | 'user-minus' | 'user-plus' | 'user-x' | 'users' | 'video' | 'video-off'  
  | 'voicemail' | 'volume' | 'volume-1' | 'volume-2' | 'volume-x' | 'watch'  
  | 'wifi' | 'wifi-off' | 'wind' | 'x' | 'x-circle' | 'x-octagon' | 'x-square'  
  | 'youtube' | 'zap' | 'zap-off' | 'zoom-in' | 'zoom-out';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  icon?: FeatherIconName;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  style,
}) => {
  const getButtonStyle = () => {
    const baseStyle: StyleProp<ViewStyle> = [styles.button, styles[`${size}Button`]];
    
    if (disabled) {
      baseStyle.push(styles.disabledButton);
    } else {
      baseStyle.push(styles[`${variant}Button`]);
    }

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: StyleProp<TextStyle> = [styles.text, styles[`${size}Text`]];
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    } else {
      baseStyle.push(styles[`${variant}Text`]);
    }
    
    return baseStyle;
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconSize = size === 'small' ? 16 : size === 'medium' ? 18 : 20;
    const iconColor = disabled 
      ? theme.colors.neutral.dark
      : variant === 'primary' || variant === 'secondary' 
        ? 'white' 
        : variant === 'outline' 
          ? theme.colors.primary.main 
          : theme.colors.primary.main;
    
    return (
      <Feather 
        name={icon} 
        size={iconSize} 
        color={iconColor} 
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight} 
      />
    );
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={disabled || isLoading}
      style={getButtonStyle()}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'secondary' ? 'white' : theme.colors.primary.main} 
          size={size === 'small' ? 'small' : 'small'} 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && renderIcon()}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '500',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  // Variants
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary.main,
    borderWidth: 1,
    borderColor: theme.colors.secondary.main,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  textButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral.light,
    borderWidth: 1,
    borderColor: theme.colors.neutral.main,
  },
  // Text styles
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: theme.colors.primary.main,
  },
  textText: {
    color: theme.colors.primary.main,
  },
  disabledText: {
    color: theme.colors.neutral.dark,
  },
  // Sizes
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});

export default Button;
