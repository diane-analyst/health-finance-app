import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(1);

  const handleComplete = async () => {
    try {
      const response = await api.post('/auth/register', {
        name: '김철수',
        phone: '01012345678',
        birthDate: '1960-01-01'
      });

      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('userId', response.user.id);

      navigation.replace('Main');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && (
          <View style={styles.welcomeContent}>
            <View style={styles.appIcon}>
              <Text style={{ fontSize: 60 }}>💙</Text>
            </View>
            <Text style={styles.subtitle}>평생 건강·재무 파트너</Text>
            <Text style={styles.title}>당신의 미래와{'\n'}대화하세요</Text>
            <Text style={styles.description}>건강과 재무를 함께 관리합니다</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(2)}>
              <Text style={styles.buttonText}>시작하기</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.greetingContent}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 40 }}>👤</Text>
            </View>
            <Text style={styles.greetingText}>
              안녕하세요!{'\n'}저는 당신의 미래,{'\n'}
              <Text style={{ color: '#0066FF', fontWeight: '700' }}>김철수</Text>예요.
            </Text>
            <Text style={styles.greetingSubtext}>평생 건강과 재무를{'\n'}함께 관리할게요.</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>시작하기 전에</Text>
              <Text style={styles.infoDesc}>건강과 재무 정보 연결이 필요해요.{'\n'}정확한 관리를 위해 필수입니다.</Text>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(3)}>
              <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.mydataContent}>
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>⚠️ 필수 연동이 필요합니다</Text>
            </View>
            <Text style={styles.mydataTitle}>데이터 연결</Text>
            <Text style={styles.mydataSubtitle}>안전하게 암호화되어 저장됩니다</Text>
            
            <View style={styles.connectionItem}>
              <View style={styles.connectionHeader}>
                <Text style={{ fontSize: 24 }}>🏥</Text>
                <Text style={styles.connectionTitle}>의료 Mydata</Text>
                <View style={[styles.badge, styles.badgeRequired]}>
                  <Text style={styles.badgeText}>필수</Text>
                </View>
              </View>
              <Text style={styles.connectionDesc}>건강검진 결과, 진료 기록, 처방약 정보</Text>
            </View>

            <View style={styles.connectionItem}>
              <View style={styles.connectionHeader}>
                <Text style={{ fontSize: 24 }}>💳</Text>
                <Text style={styles.connectionTitle}>금융 Mydata</Text>
                <View style={[styles.badge, styles.badgeRequired]}>
                  <Text style={styles.badgeText}>필수</Text>
                </View>
              </View>
              <Text style={styles.connectionDesc}>은행 계좌 잔고</Text>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
              <Text style={styles.buttonText}>연결하고 시작하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>STEP {step}/3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1, padding: 24 },
  stepIndicator: { alignItems: 'center', paddingVertical: 16 },
  stepText: { fontSize: 12, color: '#999', fontWeight: '600' },
  welcomeContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  appIcon: { width: 120, height: 120, backgroundColor: '#f0f0f0', borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: 12, lineHeight: 42 },
  subtitle: { fontSize: 14, color: '#999', marginBottom: 8 },
  description: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 60, lineHeight: 24 },
  primaryButton: { width: '100%', padding: 18, backgroundColor: '#0066FF', borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  greetingContent: { flex: 1, paddingTop: 40 },
  avatar: { width: 80, height: 80, backgroundColor: '#f0f0f0', borderRadius: 40, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  greetingText: { fontSize: 24, fontWeight: '600', textAlign: 'center', lineHeight: 36, marginBottom: 16 },
  greetingSubtext: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  infoBox: { backgroundColor: '#f8f9fa', padding: 20, borderRadius: 16, marginBottom: 32 },
  infoTitle: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  infoDesc: { fontSize: 14, color: '#666', lineHeight: 22 },
  mydataContent: { flex: 1, paddingTop: 40 },
  alertBox: { backgroundColor: '#fff3e0', padding: 16, borderRadius: 12, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#E65100' },
  alertText: { color: '#E65100', fontSize: 14, fontWeight: '600' },
  mydataTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  mydataSubtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  connectionItem: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#e0e0e0', borderRadius: 16, padding: 20, marginBottom: 16 },
  connectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  connectionTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginLeft: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeRequired: { backgroundColor: '#ffebee' },
  badgeText: { fontSize: 13, fontWeight: '600', color: '#c62828' },
  connectionDesc: { fontSize: 13, color: '#666', marginLeft: 36 },
});
