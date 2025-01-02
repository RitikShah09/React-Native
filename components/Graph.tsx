// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Dimensions,
//   StyleSheet,
//   TouchableWithoutFeedback,
// } from "react-native";
// import { LineChart } from "react-native-chart-kit";

// interface GraphData {
//   title: string;
//   labels: string[];
//   unit: string;
//   label1: string;
//   label3?: string;
//   AVG1?: number;
//   AVG2?: number;
//   line1: string[];
//   line3?: string[];
// }

// interface GraphProps {
//   data: GraphData;
//   id: string;
//   maxPoints?: number;
// }

// const Graph: React.FC<GraphProps> = ({ data, id, maxPoints = 5 }) => {
//   const screenWidth = Dimensions.get("window").width;

//   const [hoverIndex, setHoverIndex] = useState<number | null>(null);
//   const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

//   const chartConfig = {
//     backgroundGradientFrom: "#ffffff",
//     backgroundGradientTo: "#ffffff",
//     color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     strokeWidth: 2,
//     useShadowColorFromDataset: false,
//     decimalPlaces: 0,
//   };

//   const limitedLabels = data?.labels.slice(0, maxPoints) || [];
//   const limitedLine1 = data?.line1.slice(0, maxPoints).map(Number) || [];
//   const limitedLine3 = data?.line3?.slice(0, maxPoints).map(Number) || [];

//   const datasets = [];
//   if (limitedLine1) {
//     datasets.push({
//       data: limitedLine1,
//       color: (opacity = 1) => `rgba(200, 16, 46, ${opacity})`,
//       strokeWidth: 2,
//     });
//   }
//   if (limitedLine3) {
//     datasets.push({
//       data: limitedLine3,
//       color: (opacity = 1) => `rgba(16, 46, 200, ${opacity})`,
//       strokeWidth: 2,
//     });
//   }

//   const chartData = {
//     labels: limitedLabels,
//     datasets,
//     legend: [
//       ...(limitedLine1.length > 0 ? [data.label1] : []),
//       ...(limitedLine3.length > 0 && data.label3 ? [data.label3] : []),
//     ],
//   };

//   const handleDataPointClick = (data: any) => {
//     setHoverIndex(data.index);
//     setPopupPosition({ x: data.x, y: data.y });
//   };

//   const handleClickOutside = () => {
//     setHoverIndex(null);
//   };

//   useEffect(() => {
//     if (!data.labels.length || (!limitedLine1 && !limitedLine3)) {
//       console.warn(`Graph ${id} has insufficient data.`);
//     }
//   }, [data, id, limitedLine1, limitedLine3]);

//   return (
//     <TouchableWithoutFeedback onPress={handleClickOutside}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <View style={styles.avgContainer}>
//             {data.AVG1 !== undefined && (
//               <Text style={styles.avgText}>
//                 {data.label1} Avg:{" "}
//                 <Text style={styles.avgValue}>
//                   {data.AVG1} {data.unit}
//                 </Text>
//               </Text>
//             )}
//             {data.AVG2 !== undefined && data.label3 && (
//               <Text style={styles.avgText}>
//                 {data.label3} Avg:{" "}
//                 <Text style={styles.avgValue}>
//                   {data.AVG2} {data.unit}
//                 </Text>
//               </Text>
//             )}
//           </View>
//         </View>
//         {limitedLabels.length > 0 && datasets.length > 0 ? (
//           <>
//             <LineChart
//               key={id}
//               data={chartData}
//               width={screenWidth - 40}
//               height={220}
//               chartConfig={chartConfig}
//               bezier
//               fromZero
//               withOuterLines={false}
//               style={styles.chart}
//               onDataPointClick={handleDataPointClick}
//             />
//             {hoverIndex !== null && (
//               <View
//                 style={[
//                   styles.popup,
//                   { top: popupPosition.y, left: popupPosition.x },
//                 ]}
//               >
//                 <Text
//                   style={[styles.popupText, { color: "rgba(200, 16, 46, 1)" }]}
//                 >
//                   {data.label1} Value: {limitedLine1[hoverIndex]} {data.unit}
//                 </Text>
//                 {limitedLine3[hoverIndex] !== undefined && data.label3 && (
//                   <Text
//                     style={[
//                       styles.popupText,
//                       { color: "rgba(16, 46, 200, 1)" },
//                     ]}
//                   >
//                     {data.label3} Value: {limitedLine3[hoverIndex]} {data.unit}
//                   </Text>
//                 )}
//                 <Text style={styles.popupText}>
//                   Time: {limitedLabels[hoverIndex]}
//                 </Text>
//               </View>
//             )}
//           </>
//         ) : (
//           <Text style={styles.noDataText}>No data available to display.</Text>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     paddingVertical: 10,
//     paddingHorizontal: 2,
//     backgroundColor: "#ffffff",
//     borderRadius: 8,
//     marginVertical: 10,
//   },
//   header: {
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   avgContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   avgText: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 5,
//     color: "#000",
//   },
//   avgValue: {
//     color: "#C8102E",
//     fontWeight: "700",
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   popup: {
//     position: "absolute",
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     zIndex: 100,
//   },
//   popupText: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 5,
//     color: "#333",
//   },
//   noDataText: {
//     textAlign: "center",
//     color: "#C8102E",
//     fontWeight: "600",
//     marginTop: 20,
//   },
// });

// export default Graph;

import React, { useState, useEffect, useRef } from "react";
import RNFS from 'react-native-fs'; 
import { PermissionsAndroid } from 'react-native';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Button,
  Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import ViewShot from "react-native-view-shot";
import * as FileSystem from 'expo-file-system';

interface GraphData {
  title: string;
  labels: string[];
  unit: string;
  label1: string;
  label3?: string;
  AVG1?: number;
  AVG2?: number;
  line1: string[];
  line3?: string[];
}

interface GraphProps {
  data: GraphData;
  id: string;
  maxPoints?: number;
}

async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "This app needs access to your storage to save files",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const Graph: React.FC<GraphProps> = ({ data, id, maxPoints = 5 }) => {
  const screenWidth = Dimensions.get("window").width;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const viewShotRef = useRef<ViewShot>(null);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const limitedLabels = data?.labels.slice(0, maxPoints) || [];
  const limitedLine1 = data?.line1.slice(0, maxPoints).map(Number) || [];
  const limitedLine3 = data?.line3?.slice(0, maxPoints).map(Number) || [];

  const datasets = [];
  if (limitedLine1) {
    datasets.push({
      data: limitedLine1,
      color: (opacity = 1) => `rgba(200, 16, 46, ${opacity})`,
      strokeWidth: 2,
    });
  }
  if (limitedLine3) {
    datasets.push({
      data: limitedLine3,
      color: (opacity = 1) => `rgba(16, 46, 200, ${opacity})`,
      strokeWidth: 2,
    });
  }

  const chartData = {
    labels: limitedLabels,
    datasets,
    legend: [
      ...(limitedLine1.length > 0 ? [data.label1] : []),
      ...(limitedLine3.length > 0 && data.label3 ? [data.label3] : []),
    ],
  };

  const handleSaveGraph = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot save file without storage permission.');
        return;
      }

      if (viewShotRef.current) {
        // Capture the graph image as a URI (assuming you have a reference for this)
        const uri = await viewShotRef.current.capture();

        // Define the Downloads folder path and the new folder path
        const downloadsFolder = RNFS.DownloadDirectoryPath;  // Downloads folder path
        const folderPath = `${downloadsFolder}/aaf`; // Subfolder 'aaf' in Downloads
        const filePath = `${folderPath}/graph-${id}.png`; // Full path for the image

        // Check if the folder exists and create it if it doesn't
        const folderInfo = await RNFS.exists(folderPath);
        if (!folderInfo) {
          await RNFS.mkdir(folderPath); // Create the 'aaf' folder in Downloads
        }

        // Move or copy the captured file to the folder
        await RNFS.copyFile(uri, filePath);

        Alert.alert('Success', `Graph saved to: ${filePath}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save the graph.');
      console.error(error);
    }
  };
  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
          <View style={styles.header}>
            <View style={styles.avgContainer}>
              {data.AVG1 !== undefined && (
                <Text style={styles.avgText}>
                  {data.label1} Avg:{" "}
                  <Text style={styles.avgValue}>
                    {data.AVG1} {data.unit}
                  </Text>
                </Text>
              )}
              {data.AVG2 !== undefined && data.label3 && (
                <Text style={styles.avgText}>
                  {data.label3} Avg:{" "}
                  <Text style={styles.avgValue}>
                    {data.AVG2} {data.unit}
                  </Text>
                </Text>
              )}
            </View>
          </View>
          {limitedLabels.length > 0 && datasets.length > 0 ? (
            <>
              <LineChart
                key={id}
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                fromZero
                withOuterLines={false}
                style={styles.chart}
              />
            </>
          ) : (
            <Text style={styles.noDataText}>No data available to display.</Text>
          )}
        </ViewShot>
        <Button title="Save Graph as PNG" onPress={handleSaveGraph} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 2,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginVertical: 10,
  },
  header: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  avgContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  avgText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#000",
  },
  avgValue: {
    color: "#C8102E",
    fontWeight: "700",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  popup: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 100,
  },
  popupText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  noDataText: {
    textAlign: "center",
    color: "#C8102E",
    fontWeight: "600",
    marginTop: 20,
  },
});
export default Graph;
