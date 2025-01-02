import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Graph from "../components/Graph";

const SensorGraph: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [liveReading, setLiveReading] = useState(false);
  const ulimit = useRef<number>(50);
  const [limit, setLimit] = useState<number>(50);
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [sensorAverages, setSensorAverages] = useState<Record<string, any>>({});

  const instance = useRef<NodeJS.Timeout | null>(null);

  const setDataLimitHandler = (value: string) => {
    const newLimit = parseInt(value);
    if (!isNaN(newLimit)) {
      setLimit(newLimit);
      ulimit.current = newLimit;
    }
  };

  const fetchPeriodicData = async () => {
    try {
      // const response = await fetch("http://localhost:5500/api/v1/sensor-data");
      const response = await fetch(
        "https://transmonk-aaf-api.onrender.com/api/v1/sensor-data"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const averages = calculateSensorAverages(data);
      setSensorAverages(averages);
      setRawData(data);

      const formattedData1 = {
        title: "> 0.3 µm Particles",
        labels: [],
        unit: "pcs/l",
        label1: "Sensor 1",
        AVG1: averages["1"] ? parseInt(averages["1"]["pm0p3_1"]) : 0,
        AVG2: averages["2"] ? parseInt(averages["2"]["pm0p3_2"]) : 0,
        label3: "Sensor 2",
        line1: [],
        line2: [],
        line3: [],
      };

      const formattedData2 = {
        title: "> 0.5 µm Particles",
        labels: [],
        unit: "pcs/l",
        label1: "Sensor 1",
        AVG1: averages["1"] ? parseInt(averages["1"]["pm0p5_1"]) : 0,
        AVG2: averages["2"] ? parseInt(averages["2"]["pm0p5_2"]) : 0,
        label3: "Sensor 2",
        line1: [],
        line2: [],
        line3: [],
      };
      const formattedData3 = {
        title: "> 1.0 µm Particles",
        labels: [],
        unit: "pcs/l",
        label1: "Sensor 1",
        AVG1: averages["1"] ? parseInt(averages["1"]["pm1p0_1"]) : 0,
        AVG2: averages["2"] ? parseInt(averages["2"]["pm1p0_2"]) : 0,
        label3: "Sensor 2",
        line1: [],
        line2: [],
        line3: [],
      };

      const formattedData4 = {
        title: "> 2.5 µm Particles",
        labels: [],
        unit: "pcs/l",
        label1: "Sensor 1",
        AVG1: averages["1"] ? parseInt(averages["1"]["pm2p5_1"]) : 0,
        AVG2: averages["2"] ? parseInt(averages["2"]["pm2p5_2"]) : 0,
        label3: "Sensor 2",
        line1: [],
        line2: [],
        line3: [],
      };

      const formattedData5 = {
        title: "> 5.0 µm Particles",
        labels: [],
        unit: "pcs/l",
        label1: "Sensor 1",
        AVG1: averages["1"] ? parseInt(averages["1"]["pm5p0_1"]) : 0,
        AVG2: averages["2"] ? parseInt(averages["2"]["pm5p0_2"]) : 0,
        label3: "Sensor 2",
        line1: [],
        line2: [],
        line3: [],
      };

      const formattedData6 = {
        title: "> 10.0 µm Particles",
        labels: [],
        unit: "pcs/l",
        label1: "Sensor 1",
        AVG1: averages["1"] ? parseInt(averages["1"]["pm10p0_1"]) : 0,
        AVG2: averages["2"] ? parseInt(averages["2"]["pm10p0_2"]) : 0,
        label3: "Sensor 2",
        line1: [],
        line2: [],
        line3: [],
      };
      const formattedData7 = {
        title: "Differential Pressure",
        labels: [],
        unit: "Pa.",
        label1: "DP Sensor ",
        AVG1: averages["rawPressure"]
          ? parseInt(averages["rawPressure"]["rawPressure"])
          : 0,
        AVG2: sensorAverages["2"]
          ? parseInt(sensorAverages["2"]["pm0p3_2"])
          : 0,
        line1: [],
        line2: [],
        line3: [],
      };

      data.slice(0, ulimit.current).forEach((entry: any) => {
        const timestamp = new Date(entry?.createdAt);
        const ISTTime = timestamp.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        });

        formattedData1.labels.push(ISTTime);
        formattedData1.line1.push(entry.pm0p3_1);

        formattedData1.line3.push(entry.pm0p3_2);

        formattedData2.labels.push(ISTTime);
        formattedData2.line1.push(entry.pm0p5_1);

        formattedData2.line3.push(entry.pm0p5_2);

        formattedData3.labels.push(ISTTime);
        formattedData3.line1.push(entry.pm1p0_1);

        formattedData3.line3.push(entry.pm1p0_2);

        formattedData4.labels.push(ISTTime);
        formattedData4.line1.push(entry.pm2p5_1);

        formattedData4.line3.push(entry.pm2p5_2);

        formattedData5.labels.push(ISTTime);
        formattedData5.line1.push(entry.pm5p0_1);

        formattedData5.line3.push(entry.pm5p0_2);

        formattedData6.labels.push(ISTTime);
        formattedData6.line1.push(entry.pm10p0_1);

        formattedData6.line3.push(entry.pm10p0_2);
        console.log("entry.pm10p0_2", entry.pm10p0_2);

        formattedData7.labels.push(ISTTime);
        formattedData7.line1.push(entry.rawPressure);
        console.log("line3rawPressure", entry.rawPressure);
      });

      setSampleData([
        formattedData1,
        formattedData2,
        formattedData3,
        formattedData4,
        formattedData5,
        formattedData6,
        formattedData7,
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSampleData([]);
    }
  };

  const startPeriodicAPICall = () => {
    if (!instance.current) {
      setLiveReading(true);
      instance.current = setInterval(fetchPeriodicData, 5000);
    }
  };

  const stopPeriodicAPICall = () => {
    if (instance.current) {
      clearInterval(instance.current);
      setLiveReading(false);
      setSampleData([]);
      instance.current = null;
    }
  };

  const calculateSensorAverages = (data: any[]) => {
    const sensorSum: Record<string, any> = {};
    const sensorCounts: Record<string, any> = {};

    data.forEach((entry) => {
      for (const key in entry) {
        if (key.startsWith("pm") || key === "rawPressure") {
          const sensor = key.startsWith("pm")
            ? key.split("_")[1]
            : "rawPressure";
          if (!sensorSum[sensor]) {
            sensorSum[sensor] = {};
            sensorCounts[sensor] = {};
          }
          if (!sensorSum[sensor][key]) {
            sensorSum[sensor][key] = 0;
            sensorCounts[sensor][key] = 0;
          }
          sensorSum[sensor][key] += parseInt(entry[key]);
          sensorCounts[sensor][key]++;
        }
      }
    });

    const averages: Record<string, any> = {};
    for (const sensor in sensorSum) {
      averages[sensor] = {};
      for (const key in sensorSum[sensor]) {
        averages[sensor][key] =
          sensorSum[sensor][key] / sensorCounts[sensor][key];
      }
    }
    return averages;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#C8102E" />
          <Text style={styles.loaderText}>
            Please wait connecting to server...
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.limitContainer}>
              <Text style={styles.title}>Change Data Limit</Text>
              <TextInput
                style={styles.input}
                placeholder={limit.toString()}
                keyboardType="numeric"
                onChangeText={(value) => setDataLimitHandler(value)}
              />
              <Button
                title="Change"
                onPress={() => setDataLimitHandler(limit.toString())}
              />
            </View>
            {liveReading && (
              <Button title="Stop Reading" onPress={stopPeriodicAPICall} />
            )}
          </View>

          {liveReading && (
            <Text style={styles.liveText}>
              Sensor data reading is active{" "}
              <Text style={styles.liveHighlight}>Live!</Text>
            </Text>
          )}

          {sampleData.length < 1 && !liveReading && (
            <View style={styles.noDataContainer}>
              <Text>
                No data available. Click the button below to start real-time
                sensor data reading.
              </Text>
              <Button title="Start Reading" onPress={startPeriodicAPICall} />
            </View>
          )}

          <View style={styles.graphContainer}>
            {sampleData.map((data, index) => (
              <TouchableOpacity key={index}>
                <Graph
                  key={index}
                  data={data}
                  id={`chart-${index}`}
                  avg={sensorAverages}
                  limit={limit}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 16,
    color: "#C8102E",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  limitContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  liveText: {
    textAlign: "center",
    color: "green",
    fontStyle: "italic",
  },
  liveHighlight: {
    color: "#C8102E",
  },
  noDataContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  graphContainer: {
    marginTop: 16,
  },
});

export default SensorGraph;
