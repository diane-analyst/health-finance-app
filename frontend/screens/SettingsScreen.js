import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>설정 메뉴가 여기 표시됩니다</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { height: 60, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholder: { fontSize: 14, color: '#999' },
});
