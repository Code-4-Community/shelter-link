import { Image, StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { darkMainColor } from '../../constants';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentPage, setCurrentPage] = useState(0);
  // total num of "pages" for the carousel (each page holds max two images)
  const totalPages = Math.ceil(images.length / 2);

  const handleNext = () => {
    // if there r more pages to scroll right
    if (currentPage < totalPages - 1) {
      // assign current page val to be next page
      setCurrentPage((curr) => curr + 1);
    }
  };

  const handlePrev = () => {
    // if there r more pages to scroll left
    if (currentPage > 0) {
      // assign current page val to be next page
      setCurrentPage((curr) => curr - 1);
    }
  };

  const startIdx = currentPage * 2;
  const currentImages = images.slice(startIdx, startIdx + 2);

  return (
    <View style={styles.galleryContainer}>
      {/* renders left arrow button if there are any more pages in that direction */}
      {currentPage > 0 && (
        <TouchableOpacity
          style={[styles.navButton, styles.leftButton]}
          onPress={handlePrev}
        >
          <Text style={styles.navButtonText}>◀</Text>
        </TouchableOpacity>
      )}

      {/* renders images for current page */}
      <View style={styles.imagesContainer}>
        {currentImages.map((url, index) => (
          <Image
            key={startIdx + index}
            source={{ uri: url }}
            style={styles.shelterImage}
          />
        ))}
      </View>

      {/* renders right arrow button if there are any more pages in that direction */}
      {currentPage < totalPages - 1 && (
        <TouchableOpacity
          style={[styles.navButton, styles.rightButton]}
          onPress={handleNext}
        >
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  galleryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 22,
  },
  shelterImage: {
    width: screenWidth/3,
    height: screenWidth/3,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: darkMainColor,
    backgroundColor: '#D9D9D9',
  },
  navButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    height: '100%',
    paddingHorizontal: 10,
  },
  leftButton: {
    left: -screenWidth/10,
  },
  rightButton: {
    right: -screenWidth/10,
  },
  navButtonText: {
    color: darkMainColor,
    fontSize: 24,
  },
});
