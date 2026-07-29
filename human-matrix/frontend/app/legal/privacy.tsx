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

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Politique de Confidentialité</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdate}>Dernière mise à jour : Mars 2026</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Mental Nation ("nous", "notre", "l'application") s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles.
        </Text>

        <Text style={styles.sectionTitle}>2. Données collectées</Text>
        <Text style={styles.paragraph}>
          Nous collectons les données suivantes :
        </Text>
        <Text style={styles.listItem}>• Informations de compte Google (email, nom, photo de profil)</Text>
        <Text style={styles.listItem}>• Résultats des diagnostics de souveraineté</Text>
        <Text style={styles.listItem}>• Progression dans le protocole 7 jours</Text>
        <Text style={styles.listItem}>• Données de paiement (traitées par Stripe)</Text>

        <Text style={styles.sectionTitle}>3. Utilisation des données</Text>
        <Text style={styles.paragraph}>
          Vos données sont utilisées pour :
        </Text>
        <Text style={styles.listItem}>• Fournir et personnaliser nos services</Text>
        <Text style={styles.listItem}>• Suivre votre progression dans le protocole</Text>
        <Text style={styles.listItem}>• Générer vos rapports de souveraineté</Text>
        <Text style={styles.listItem}>• Traiter vos paiements de manière sécurisée</Text>

        <Text style={styles.sectionTitle}>4. Partage des données</Text>
        <Text style={styles.paragraph}>
          Nous ne vendons jamais vos données personnelles. Nous partageons vos données uniquement avec :
        </Text>
        <Text style={styles.listItem}>• Stripe pour le traitement des paiements</Text>
        <Text style={styles.listItem}>• Google pour l'authentification</Text>

        <Text style={styles.sectionTitle}>5. Sécurité</Text>
        <Text style={styles.paragraph}>
          Nous utilisons des mesures de sécurité conformes aux standards de l'industrie pour protéger vos données, incluant le chiffrement SSL/TLS et le stockage sécurisé.
        </Text>

        <Text style={styles.sectionTitle}>6. Vos droits</Text>
        <Text style={styles.paragraph}>
          Conformément au RGPD, vous disposez des droits suivants :
        </Text>
        <Text style={styles.listItem}>• Droit d'accès à vos données</Text>
        <Text style={styles.listItem}>• Droit de rectification</Text>
        <Text style={styles.listItem}>• Droit à l'effacement ("droit à l'oubli")</Text>
        <Text style={styles.listItem}>• Droit à la portabilité des données</Text>
        <Text style={styles.listItem}>• Droit d'opposition</Text>

        <Text style={styles.sectionTitle}>7. Conservation des données</Text>
        <Text style={styles.paragraph}>
          Vos données sont conservées pendant la durée de votre utilisation du service et jusqu'à 3 ans après votre dernière connexion, sauf demande de suppression.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact</Text>
        <Text style={styles.paragraph}>
          Pour toute question concernant cette politique ou pour exercer vos droits, contactez-nous à : contact@mentalnation.com
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Mental Nation © 2026</Text>
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
  lastUpdate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 24,
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
  listItem: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 24,
    marginLeft: 8,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#4b5563',
  },
});
