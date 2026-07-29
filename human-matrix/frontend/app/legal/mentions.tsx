import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LegalMentions() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mentions Légales</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Éditeur de l'application</Text>
        <Text style={styles.paragraph}>
          Mental Nation
        </Text>
        <Text style={styles.infoItem}>Représentant légal : HASSANI MOUSTOIFA</Text>
        <Text style={styles.infoItem}>Email : contact@mentalnation.com</Text>

        <Text style={styles.sectionTitle}>Hébergement</Text>
        <Text style={styles.paragraph}>
          L'application est hébergée par :
        </Text>
        <Text style={styles.infoItem}>Emergent Agent</Text>
        <Text style={styles.infoItem}>Service cloud sécurisé</Text>

        <Text style={styles.sectionTitle}>Traitement des paiements</Text>
        <Text style={styles.paragraph}>
          Les paiements sont traités de manière sécurisée par :
        </Text>
        <Text style={styles.infoItem}>Stripe Payments Europe, Ltd.</Text>
        <Text style={styles.infoItem}>1 Grand Canal Street Lower, Dublin 2, Irlande</Text>

        <Text style={styles.sectionTitle}>Données personnelles</Text>
        <Text style={styles.paragraph}>
          Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
        </Text>
        <Text style={styles.paragraph}>
          Pour exercer ces droits, contactez-nous à : contact@mentalnation.com
        </Text>

        <Text style={styles.sectionTitle}>Propriété intellectuelle</Text>
        <Text style={styles.paragraph}>
          L'ensemble des éléments de l'application Mental Nation (textes, images, sons, logos, marques, etc.) est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
        </Text>
        <Text style={styles.paragraph}>
          Toute reproduction, représentation, modification ou exploitation non autorisée est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
        </Text>

        <Text style={styles.sectionTitle}>Cookies</Text>
        <Text style={styles.paragraph}>
          L'application utilise des cookies techniques nécessaires à son bon fonctionnement (authentification, préférences). Aucun cookie publicitaire ou de tracking n'est utilisé.
        </Text>

        <Text style={styles.sectionTitle}>Crédits</Text>
        <Text style={styles.paragraph}>
          Conception et développement : Mental Nation
        </Text>
        <Text style={styles.paragraph}>
          Icônes : Ionicons
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Mental Nation © 2026</Text>
          <Text style={styles.footerText}>Tous droits réservés</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginRight: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 22,
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 24,
    marginLeft: 8,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#4b5563',
  },
});
