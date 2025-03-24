import React, { useState, useRef, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Pressable,
  Image,
  Dimensions,
  PanResponder,
  Animated,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../services/photoService';

interface AnnotationsModalProps {
  photo: Photo;
  visible: boolean;
  onClose: () => void;
  onUpdate: (updatedPhoto: Photo) => void;
}

interface DrawingPoint {
  x: number;
  y: number;
}

interface Circle {
  x: number;
  y: number;
  radius: number;
}

const AnnotationsModal: React.FC<AnnotationsModalProps> = ({
  photo,
  visible,
  onClose,
  onUpdate
}) => {
  const [title, setTitle] = useState(photo?.title || '');
  const [description, setDescription] = useState(photo?.description || '');
  const [progress, setProgress] = useState(photo?.progress || 0);
  const [notes, setNotes] = useState(photo?.notes || []);
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [flagged, setFlagged] = useState(photo?.flagged || false);
  const [flagReason, setFlagReason] = useState(photo?.flag_reason || '');
  const [activeTab, setActiveTab] = useState<'note' | 'tag' | 'tasks' | 'draw'>('note');
  const [photoName, setPhotoName] = useState('');
  const [photoDate, setPhotoDate] = useState('');
  const [drawingMode, setDrawingMode] = useState<'pen' | 'circle'>('pen');
  const [lines, setLines] = useState<DrawingPoint[][]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawingPoint[]>([]);
  const [currentCircle, setCurrentCircle] = useState<Circle | null>(null);
  const [imageHeight, setImageHeight] = useState(300);
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (visible && photo) {
      setTitle(photo.title || '');
      setDescription(photo.description || '');
      setProgress(photo.progress || 0);
      setNotes(photo.notes || []);
      setFlagged(photo.flagged || false);
      setFlagReason(photo.flag_reason || '');
      if (photo.name) {
        setPhotoName(photo.name);
      } else {
        // Extract filename from URL as default name
        const urlParts = photo.url.split('/');
        const fileName = urlParts[urlParts.length - 1].split('.')[0];
        setPhotoName(fileName);
      }
      if (photo.date) {
        setPhotoDate(photo.date);
      } else {
        // Set current date as default
        const today = new Date();
        setPhotoDate(today.toISOString().split('T')[0]);
      }
      if (photo.tags) {
        setTags(photo.tags);
      }
    }
  }, [visible, photo]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        
        if (drawingMode === 'pen') {
          setCurrentLine([{ x: locationX, y: locationY }]);
        } else if (drawingMode === 'circle') {
          setCurrentCircle({ x: locationX, y: locationY, radius: 0 });
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        
        if (drawingMode === 'pen') {
          setCurrentLine(prev => [...prev, { x: locationX, y: locationY }]);
        } else if (drawingMode === 'circle' && currentCircle) {
          const dx = locationX - currentCircle.x;
          const dy = locationY - currentCircle.y;
          const radius = Math.sqrt(dx * dx + dy * dy);
          setCurrentCircle({ ...currentCircle, radius });
        }
      },
      onPanResponderRelease: () => {
        if (drawingMode === 'pen' && currentLine.length > 0) {
          setLines(prev => [...prev, currentLine]);
          setCurrentLine([]);
        } else if (drawingMode === 'circle' && currentCircle) {
          setCircles(prev => [...prev, currentCircle]);
          setCurrentCircle(null);
        }
      }
    })
  ).current;

  const calculateImageHeight = () => {
    if (photo) {
      const screenWidth = Dimensions.get('window').width * 0.9; // 90% of screen width
      const maxWidth = 500; // Max modal width
      const width = Math.min(screenWidth, maxWidth);
      
      // Default aspect ratio if we can't get the actual dimensions
      const defaultHeight = width * 0.75;
      
      Image.getSize(photo.url, (imgWidth, imgHeight) => {
        const ratio = imgHeight / imgWidth;
        setImageHeight(width * ratio);
      }, () => {
        // Error fallback
        setImageHeight(defaultHeight);
      });
    }
  };

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
    
    // Update the photo object if callback is provided
    if (photo && onUpdate) {
      onUpdate({
        ...photo,
        progress: newProgress
      });
    }
  };

  const handleSave = async () => {
    if (!photo) return;
    
    setIsSaving(true);
    try {
      const updatedPhoto = {
        ...photo,
        title,
        description,
        progress,
        notes,
        flagged,
        flag_reason: flagReason
      };
      
      await onUpdate(updatedPhoto);
      onClose();
    } catch (error) {
      console.error('Error saving annotations:', error);
      alert('Failed to save annotations. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: Math.random().toString(36).substr(2, 9),
      text: newNote.trim(),
      timestamp: new Date().toISOString()
    };
    
    setNotes([...notes, note]);
    setNewNote('');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  // Initialize image height when modal becomes visible
  React.useEffect(() => {
    if (visible && photo) {
      calculateImageHeight();
    }
  }, [visible, photo]);

  if (!photo) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Photo Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView}>
            {/* Photo metadata section */}
            <View style={styles.metadataContainer}>
              <View style={styles.metadataField}>
                <Text style={styles.metadataLabel}>Name:</Text>
                <TextInput
                  style={styles.metadataInput}
                  value={photoName}
                  onChangeText={setPhotoName}
                  placeholder="Enter photo name"
                />
              </View>
              
              <View style={styles.metadataField}>
                <Text style={styles.metadataLabel}>Date:</Text>
                <TextInput
                  style={styles.metadataInput}
                  value={photoDate}
                  onChangeText={setPhotoDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.flagContainer}>
                <Text style={styles.metadataLabel}>Important:</Text>
                <TouchableOpacity 
                  style={styles.flagButton} 
                  onPress={() => setFlagged(!flagged)}
                >
                  <Ionicons 
                    name={flagged ? "flag" : "flag-outline"} 
                    size={24} 
                    color={flagged ? "#dc2626" : "#9ca3af"} 
                  />
                </TouchableOpacity>
                {flagged && (
                  <TextInput
                    style={styles.flagReasonInput}
                    value={flagReason}
                    onChangeText={setFlagReason}
                    placeholder="Reason for flag (optional)"
                    placeholderTextColor="#9ca3af"
                  />
                )}
              </View>
            </View>

            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Progress Slider */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Progress: {progress}%</Text>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => updateProgress(Number(e.target.value))}
                style={styles.slider}
              />
            </View>

            {/* Notes Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notes</Text>
              <View style={styles.noteInputContainer}>
                <TextInput
                  style={[styles.input, styles.noteInput]}
                  value={newNote}
                  onChangeText={setNewNote}
                  placeholder="Add a note"
                />
                <TouchableOpacity 
                  style={styles.addNoteButton}
                  onPress={handleAddNote}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              
              {/* Notes List */}
              <View style={styles.notesList}>
                {notes.map((note) => (
                  <View key={note.id} style={styles.noteItem}>
                    <Text style={styles.noteText}>{note.text}</Text>
                    <TouchableOpacity 
                      onPress={() => handleDeleteNote(note.id)}
                      style={styles.deleteNoteButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Image Display */}
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: photo.url }} 
                style={[styles.image, { height: imageHeight }]}
                resizeMode="contain"
              />
              
              {/* Drawing Canvas Overlay */}
              {activeTab === 'draw' && (
                <View 
                  style={[styles.drawingCanvas, { height: imageHeight }]} 
                  {...panResponder.panHandlers}
                >
                  {/* Render existing lines */}
                  {lines.map((line, index) => (
                    <View key={`line-${index}`} style={styles.lineContainer}>
                      {line.map((point, pointIndex) => (
                        pointIndex > 0 && (
                          <View 
                            key={`point-${pointIndex}`}
                            style={[
                              styles.line,
                              {
                                left: line[pointIndex - 1].x,
                                top: line[pointIndex - 1].y,
                                width: Math.sqrt(
                                  Math.pow(point.x - line[pointIndex - 1].x, 2) + 
                                  Math.pow(point.y - line[pointIndex - 1].y, 2)
                                ),
                                transform: [
                                  {
                                    rotate: `${Math.atan2(
                                      point.y - line[pointIndex - 1].y,
                                      point.x - line[pointIndex - 1].x
                                    )}rad`
                                  }
                                ]
                              }
                            ]}
                          />
                        )
                      ))}
                    </View>
                  ))}
                  
                  {/* Render current line */}
                  {currentLine.length > 0 && (
                    <View style={styles.lineContainer}>
                      {currentLine.map((point, pointIndex) => (
                        pointIndex > 0 && (
                          <View 
                            key={`current-point-${pointIndex}`}
                            style={[
                              styles.line,
                              {
                                left: currentLine[pointIndex - 1].x,
                                top: currentLine[pointIndex - 1].y,
                                width: Math.sqrt(
                                  Math.pow(point.x - currentLine[pointIndex - 1].x, 2) + 
                                  Math.pow(point.y - currentLine[pointIndex - 1].y, 2)
                                ),
                                transform: [
                                  {
                                    rotate: `${Math.atan2(
                                      point.y - currentLine[pointIndex - 1].y,
                                      point.x - currentLine[pointIndex - 1].x
                                    )}rad`
                                  }
                                ]
                              }
                            ]}
                          />
                        )
                      ))}
                    </View>
                  )}
                  
                  {/* Render circles */}
                  {circles.map((circle, index) => (
                    <View 
                      key={`circle-${index}`}
                      style={[
                        styles.circle,
                        {
                          left: circle.x - circle.radius,
                          top: circle.y - circle.radius,
                          width: circle.radius * 2,
                          height: circle.radius * 2,
                          borderRadius: circle.radius
                        }
                      ]}
                    />
                  ))}
                  
                  {/* Render current circle */}
                  {currentCircle && (
                    <View 
                      style={[
                        styles.circle,
                        {
                          left: currentCircle.x - currentCircle.radius,
                          top: currentCircle.y - currentCircle.radius,
                          width: currentCircle.radius * 2,
                          height: currentCircle.radius * 2,
                          borderRadius: currentCircle.radius
                        }
                      ]}
                    />
                  )}
                </View>
              )}
            </View>

            {/* Tab Container */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'note' && styles.activeTabButton]}
                onPress={() => setActiveTab('note')}
              >
                <Ionicons name="document-text-outline" size={20} color="#666" />
                <Text style={styles.tabText}>Notes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'tag' && styles.activeTabButton]}
                onPress={() => setActiveTab('tag')}
              >
                <Ionicons name="pricetag-outline" size={20} color="#666" />
                <Text style={styles.tabText}>Tags</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'tasks' && styles.activeTabButton]}
                onPress={() => setActiveTab('tasks')}
              >
                <Ionicons name="checkbox-outline" size={20} color="#666" />
                <Text style={styles.tabText}>Tasks</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'draw' && styles.activeTabButton]}
                onPress={() => setActiveTab('draw')}
              >
                <Ionicons name="pencil-outline" size={20} color="#666" />
                <Text style={styles.tabText}>Draw</Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <View style={styles.tabContent}>
              {activeTab === 'note' && (
                <View style={styles.noteContainer}>
                  <TextInput
                    style={styles.noteInput}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Add description about this photo..."
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              )}
              
              {activeTab === 'tag' && (
                <View style={styles.tagContainer}>
                  <View style={styles.tagInputContainer}>
                    <TextInput
                      style={styles.tagInput}
                      value={newTag}
                      onChangeText={setNewTag}
                      placeholder="Add a tag..."
                    />
                    <TouchableOpacity 
                      style={styles.addTagButton}
                      onPress={() => {
                        if (newTag.trim()) {
                          setTags([...tags, newTag.trim()]);
                          setNewTag('');
                        }
                      }}
                    >
                      <Text style={styles.addTagButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.tagsListContainer}>
                    {tags.length === 0 ? (
                      <Text style={styles.noTagsText}>No tags added yet</Text>
                    ) : (
                      <View style={styles.tagsList}>
                        {tags.map((tag, index) => (
                          <View key={`tag-${index}`} style={styles.tagItem}>
                            <Text style={styles.tagText}>{tag}</Text>
                            <TouchableOpacity
                              style={styles.removeTagButton}
                              onPress={() => {
                                setTags(tags.filter((_, i) => i !== index));
                              }}
                            >
                              <Ionicons name="close-circle" size={16} color="#666" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              )}

              {activeTab === 'tasks' && (
                <View style={styles.tasksContainer}>
                  <Text style={styles.placeholderText}>Add tasks related to this photo</Text>
                  <View style={styles.taskInputContainer}>
                    <TextInput
                      style={styles.taskInput}
                      placeholder="Enter a task..."
                      placeholderTextColor="#9ca3af"
                      value={newTask}
                      onChangeText={setNewTask}
                    />
                    <TouchableOpacity style={styles.taskAddButton}>
                      <Ionicons name="add-circle" size={24} color="#001532" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tasksList}>
                    <View style={styles.taskItem}>
                      <Text style={styles.taskText}>Follow up with contractor</Text>
                      <TouchableOpacity style={styles.taskCheckbox}>
                        <Ionicons name="square-outline" size={20} color="#001532" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.taskItem}>
                      <Text style={styles.taskText}>Order additional materials</Text>
                      <TouchableOpacity style={styles.taskCheckbox}>
                        <Ionicons name="square-outline" size={20} color="#001532" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {activeTab === 'draw' && (
                <View style={styles.drawToolsContainer}>
                  <View style={styles.drawToolsRow}>
                    <TouchableOpacity 
                      style={[styles.drawTool, drawingMode === 'pen' && styles.activeDrawTool]}
                      onPress={() => setDrawingMode('pen')}
                    >
                      <Ionicons name="pencil" size={24} color="#001532" />
                      <Text style={styles.drawToolText}>Pen</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.drawTool, drawingMode === 'circle' && styles.activeDrawTool]}
                      onPress={() => setDrawingMode('circle')}
                    >
                      <Ionicons name="ellipse-outline" size={24} color="#001532" />
                      <Text style={styles.drawToolText}>Circle</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.drawTool}
                      onPress={() => {
                        setLines([]);
                        setCircles([]);
                        setCurrentLine([]);
                        setCurrentCircle(null);
                      }}
                    >
                      <Ionicons name="trash-outline" size={24} color="#001532" />
                      <Text style={styles.drawToolText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
          
          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#001532',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metadataContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  metadataField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    width: 60,
  },
  metadataInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
  },
  drawingCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  lineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  line: {
    position: 'absolute',
    height: 3,
    backgroundColor: 'red',
    transformOrigin: 'left center',
  },
  circle: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'red',
    backgroundColor: 'transparent',
  },
  progressBarContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  sliderContainer: {
    width: '100%',
  },
  progressColorLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#6b7280',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#001532',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#4b5563',
  },
  tabContent: {
    padding: 16,
  },
  noteContainer: {
    width: '100%',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 12,
  },
  noteInputContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
  },
  noteInput: {
    fontSize: 14,
    color: '#1f2937',
    minHeight: 120,
  },
  tagContainer: {
    flex: 1,
    padding: 16,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  addTagButton: {
    backgroundColor: '#001532',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
    justifyContent: 'center',
  },
  addTagButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tagsListContainer: {
    flex: 1,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#4b5563',
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
  noTagsText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  flagButton: {
    marginLeft: 8,
    padding: 4,
  },
  flagReasonInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    marginLeft: 8,
  },
  tasksContainer: {
    width: '100%',
    padding: 16,
  },
  taskInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  taskInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
  },
  taskAddButton: {
    padding: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksList: {
    width: '100%',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  taskText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  taskCheckbox: {
    padding: 4,
  },
  drawToolsContainer: {
    width: '100%',
    padding: 16,
  },
  drawToolsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  drawTool: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  activeDrawTool: {
    backgroundColor: '#e5e7eb',
  },
  drawToolText: {
    fontSize: 12,
    marginTop: 4,
    color: '#4b5563',
  },
  saveButton: {
    backgroundColor: '#001532',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    margin: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AnnotationsModal;
