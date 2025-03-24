import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ReportSettings, ReportSettingsType, ReportImage, ReportTemplateType } from '../../types/reports';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  headerCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  logoContainer: {
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 50,
    objectFit: 'contain',
  },
  titleContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001532',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  companyContact: {
    fontSize: 10,
    color: '#666666',
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    fontSize: 10,
    color: '#666666',
  },
  imageWrapper: {
    marginBottom: 30,
  },
  imageRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageRow3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageRow4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageItem2: {
    width: '48%',
  },
  imageItem3: {
    width: '31%',
  },
  imageItem4: {
    width: '23%',
  },
  image: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    marginBottom: 8,
    borderRadius: 4,
  },
  imageCaption: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 4,
  },
  imageNotes: {
    fontSize: 8,
    color: '#666666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#999999',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 10,
    color: '#999999',
  },
});

interface ReportDocumentProps {
  settings: ReportSettingsType;
  photos: string[];
  template: ReportTemplateType | null;
}

const ReportDocument: React.FC<ReportDocumentProps> = ({ settings, photos, template }) => {
  // Function to group images by number per page
  const getImageGroups = (imagesPerPage: number) => {
    const groups = [];
    const sortedImages = [...settings.images].sort((a, b) => a.order - b.order);
    
    for (let i = 0; i < sortedImages.length; i += imagesPerPage) {
      groups.push(sortedImages.slice(i, i + imagesPerPage));
    }
    
    return groups;
  };

  // Get image data by ID
  const getPhotoById = (imageId: string) => {
    return photos.find(photo => photo === imageId) || '';
  };

  // Create header based on position setting
  const renderHeader = () => {
    const headerContent = (
      <>
        {settings.company.logo && (
          <View style={styles.logoContainer}>
            <Image src={settings.company.logo} style={styles.logo} />
          </View>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{settings.title}</Text>
          {settings.subtitle && <Text style={styles.subtitle}>{settings.subtitle}</Text>}
        </View>
        <View>
          <Text style={styles.companyName}>{settings.company.name}</Text>
          {settings.company.contact && (
            <Text style={styles.companyContact}>{settings.company.contact}</Text>
          )}
        </View>
      </>
    );

    switch (settings.layout.headerPosition) {
      case 'left':
        return <View style={styles.headerLeft}>{headerContent}</View>;
      case 'right':
        return <View style={styles.headerRight}>{headerContent}</View>;
      case 'center':
      default:
        return <View style={styles.headerCenter}>{headerContent}</View>;
    }
  };

  // Create metadata section
  const renderMetadata = () => {
    if (!settings.metadata.showDate && !settings.metadata.showAuthor && !settings.metadata.showProject) {
      return null;
    }

    return (
      <View style={styles.metadataContainer}>
        {settings.metadata.showDate && (
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        )}
        {settings.metadata.showAuthor && (
          <Text>Author: John Smith</Text>
        )}
        {settings.metadata.showProject && (
          <Text>Project: Office Renovation</Text>
        )}
      </View>
    );
  };

  // Render groups of images based on imagesPerPage setting
  const renderImageGroups = () => {
    const { imagesPerPage } = settings.layout;
    const imageGroups = getImageGroups(imagesPerPage);
    const imageItemStyle = 
      imagesPerPage === 2 ? styles.imageItem2 :
      imagesPerPage === 3 ? styles.imageItem3 :
      styles.imageItem4;
    const imageRowStyle = 
      imagesPerPage === 2 ? styles.imageRow2 :
      imagesPerPage === 3 ? styles.imageRow3 :
      styles.imageRow4;

    return imageGroups.map((group, groupIndex) => (
      <Page key={`page-${groupIndex}`} size="A4" style={styles.page}>
        {groupIndex === 0 && renderHeader()}
        {groupIndex === 0 && renderMetadata()}
        
        <View style={imageRowStyle}>
          {group.map((imageItem) => {
            const photo = getPhotoById(imageItem.imageId);
            return (
              <View key={imageItem.id} style={imageItemStyle}>
                <Image src={photo} style={styles.image} />
                {settings.layout.includeImageData && (
                  <>
                    {imageItem.caption && (
                      <Text style={styles.imageCaption}>{imageItem.caption}</Text>
                    )}
                    {imageItem.notes && (
                      <Text style={styles.imageNotes}>{imageItem.notes}</Text>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.pageNumber}>Page {groupIndex + 1}</Text>
        <Text style={styles.footer}>{settings.company.name} • Report generated on {new Date().toLocaleDateString()}</Text>
      </Page>
    ));
  };

  return (
    <Document>
      {settings.images.length > 0 ? renderImageGroups() : (
        <Page size="A4" style={styles.page}>
          {renderHeader()}
          {renderMetadata()}
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Text>No images have been added to this report.</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default ReportDocument;
