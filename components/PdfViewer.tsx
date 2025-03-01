import React, { useState, useEffect } from "react";
import { View, Text, Platform, ActivityIndicator, Linking } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Button } from "react-native";

interface PdfViewerProps {
  url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        if (Platform.OS === "web") {
          // For web, we'll just use Google Docs Viewer directly
          // No need to fetch or process the PDF
          setPdfUri(url);
          setLoading(false);
          return;
        }

        // For native platforms, we need to download the PDF
        const downloadResumable = FileSystem.createDownloadResumable(
          url,
          FileSystem.documentDirectory + "downloaded.pdf",
          {},
          (downloadProgress) => {
            const progress =
              downloadProgress.totalBytesWritten /
              downloadProgress.totalBytesExpectedToWrite;
            console.log(`Download progress: ${progress * 100}%`);
          }
        );

        const result = await downloadResumable.downloadAsync();
        if (result) {
          console.log("PDF downloaded to:", result.uri);
          setPdfUri(result.uri);
        } else {
          throw new Error("Download failed");
        }
      } catch (error) {
        console.error("Error downloading PDF:", error);
        setError("Error al cargar el PDF. Por favor intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    // No need for cleanup since we're not using object URLs anymore
  }, [url]);

  const sharePdf = async () => {
    if (Platform.OS === "web") {
      // For web, we'll use the original URL for sharing
      window.open(url, "_blank");
      return;
    }

    if (pdfUri && (await Sharing.isAvailableAsync())) {
      try {
        await Sharing.shareAsync(pdfUri);
      } catch (error) {
        console.error("Error sharing PDF:", error);
      }
    }
  };

  const openPdfInNative = () => {
    if (pdfUri) {
      Linking.openURL(pdfUri).catch((err) => {
        console.error("Error opening PDF in native viewer:", err);
        setError("No se pudo abrir el PDF con un visor nativo.");
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 w-full min-h-[500px] justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Cargando PDF...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 w-full min-h-[500px] justify-center items-center">
        <Text className="text-red-500 mb-2">{error}</Text>
        <Button title="Reintentar" onPress={() => setPdfUri(null)} />
      </View>
    );
  }

  if (Platform.OS === "web") {
    // For web, use Google Docs Viewer in an iframe
    const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true`;

    return (
      <View className="w-full h-[500px]">
        <iframe
          src={googleDocsViewerUrl}
          className="w-full h-full border-none"
          title="PDF Document"
          frameBorder="0"
        />
        <View className="mt-2 flex flex-row justify-center">
          <Button title="Abrir en nueva pestaña" onPress={sharePdf} />
        </View>
      </View>
    );
  }

  // For native platforms (iOS, Android)
  return (
    <View className="flex-1 w-full min-h-[500px]">
      {pdfUri ? (
        <>
          <WebView
            className="flex-1 w-full h-[450px]"
            source={{
              uri:
                Platform.OS === "ios"
                  ? pdfUri
                  : `https://docs.google.com/viewer?url=${encodeURIComponent(
                      url
                    )}&embedded=true`,
            }}
            originWhitelist={["*"]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            renderLoading={() => (
              <View className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
            startInLoadingState={true}
          />
          <View className="mt-2 flex flex-row justify-around">
            <Button title="Compartir PDF" onPress={sharePdf} />
          </View>
        </>
      ) : (
        <Text className="text-red-500">No se pudo cargar el PDF</Text>
      )}
    </View>
  );
};

export default PdfViewer;
