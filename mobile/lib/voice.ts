import { Audio } from 'expo-av';

let recordingInstance: Audio.Recording | null = null;

export async function startRecording(): Promise<boolean> {
  try {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== 'granted') return false;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recordingInstance = recording;
    return true;
  } catch (err) {
    return false;
  }
}

export async function stopRecording(): Promise<string | null> {
  if (!recordingInstance) return null;
  try {
    await recordingInstance.stopAndUnloadAsync();
    const uri = recordingInstance.getURI();
    recordingInstance = null;
    return uri;
  } catch (err) {
    recordingInstance = null;
    return null;
  }
}
