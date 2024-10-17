export interface Scene {
  scene: number;
  start: number;
  end: number;
  description: string;
}

// Helper to convert time string to seconds
const timeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":").map(parseFloat);
  return hours * 3600 + minutes * 60 + seconds;
};

// Function to fetch and combine scene data
export const fetchAndCombineScenes = async (): Promise<Scene[]> => {
  try {
    // Fetch scene detection data (plain text)
    const detectionResponse = await fetchWithErrorHandling('https://demo.raptvideo.com/TearsOfSteel/detect-scenes/scene-detection.txt');
    const detectionText = await detectionResponse.text();
  
    // Fetch scene description data (plain text)
    const descriptionResponse = await fetchWithErrorHandling('https://demo.raptvideo.com/TearsOfSteel/describe-scene/scene-description.txt');
    const descriptionText = await descriptionResponse.text();
  
    // Parse the scene detection text
    const parsedDetection = parseSceneDetection(detectionText);
  
    // Parse the scene description text
    const parsedDescriptions = parseSceneDescriptions(descriptionText);

    // Combine both datasets
    const combinedScenes = parsedDetection.map(detection => {
      const description = parsedDescriptions.find(
        desc => desc.scene === detection.scene
      )?.description || 'No description available';
  
      return {
        ...detection,
        description,
      };
    });

    return combinedScenes;
  } catch (error) {
    console.error('Error fetching or combining scenes:', error);
    throw new Error('Failed to fetch and combine scenes');
  }
};

// Fetch helper with error handling
const fetchWithErrorHandling = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
  }
  return response;
};

// Function to parse scene detection data (improved to be more readable)
const parseSceneDetection = (text: string): Array<{ scene: number, start: number, end: number }> => {
  const lines = text.split('\n').filter(Boolean);
  return lines.map(line => {
    const match = line.match(/Scene (\d+) Start (\d{2}:\d{2}:\d{2}\.\d{3}) End (\d{2}:\d{2}:\d{2}\.\d{3})/);
    if (match) {
      const [, scene, start, end] = match;
      return {
        scene: parseInt(scene, 10),
        start: timeToSeconds(start),
        end: timeToSeconds(end),
      };
    }
    return null;
  }).filter(Boolean) as Array<{ scene: number, start: number, end: number }>;
};

// Improved function to parse scene descriptions that handles multi-line descriptions
const parseSceneDescriptions = (text: string): Array<{ scene: number, description: string }> => {
  const lines = text.split('\n').filter(Boolean);
  const descriptions: Array<{ scene: number, description: string }> = [];
  let currentScene: number | null = null;
  let currentDescription: string = '';

  lines.forEach(line => {
    const sceneMatch = line.match(/Scene (\d+) Description\s*(.*)/i);
    if (sceneMatch) {
      // If we encounter a new scene, save the previous scene and description
      if (currentScene !== null) {
        descriptions.push({ scene: currentScene, description: currentDescription.trim() });
      }
      // Start a new scene
      currentScene = parseInt(sceneMatch[1], 10);
      currentDescription = sceneMatch[2] ? sceneMatch[2].trim() + ' ' : ''; // Add rest of the line if present
    } else if (currentScene !== null) {
      // Append the line to the current description
      currentDescription += '\n' + ' * * *' + '\n' + line + ' ';
    }
  });

  // Push the last scene
  if (currentScene !== null) {
    descriptions.push({ scene: currentScene, description: currentDescription.trim() });
  }

  return descriptions;
};
