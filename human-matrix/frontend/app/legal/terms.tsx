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

export default function TermsOfService() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conditions d'Utilisation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdate}>Dernière mise à jour : Mars 2026</Text>

        <Text style={styles.sectionTitle}>1. Acceptation des conditions</Text>
        <Text style={styles.paragraph}>
          En utilisant l'application Mental Nation, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.
        </Text>

        <Text style={styles.sectionTitle}>2. Description du service</Text>
        <Text style={styles.paragraph}>
          Mental Nation est une application de coaching mental proposant :
        </Text>
        <Text style={styles.listItem}>• Un diagnostic de souveraineté gratuit</Text>
        <Text style={styles.listItem}>• Un protocole de restauration de 7 jours (17€)</Text>
        <Text style={styles.listItem}>• Des briefings audio quotidiens</Text>
        <Text style={styles.listItem}>• Des missions personnalisées par intelligence artificielle</Text>
        <Text style={styles.listItem}>• Un système SOS d'urgence</Text>

        <Text style={styles.sectionTitle}>3. Compte utilisateur</Text>
        <Text style={styles.paragraph}>
          Pour accéder au protocole payant, vous devez créer un compte via Google. Vous êtes responsable de la confidentialité de votre compte et de toutes les activités qui s'y déroulent.
        </Text>

        <Text style={styles.sectionTitle}>4. Paiement et remboursement</Text>
        <Text style={styles.paragraph}>
          Le Pack 7 Jours est facturé 17€ en paiement unique. Les paiements sont traités de manière sécurisée par Stripe.
        </Text>
        <Text style={styles.paragraph}>
          Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contenus numériques fournis sur un support immatériel dont l'exécution a commencé avec l'accord du consommateur.
        </Text>

        <Text style={styles.sectionTitle}>5. Propriété intellectuelle</Text>
        <Text style={styles.paragraph}>
          Tous les contenus de l'application (textes, audios, graphiques, logos) sont la propriété exclusive de Mental Nation et sont protégés par les lois sur la propriété intellectuelle.
        </Text>

        <Text style={styles.sectionTitle}>6. Limitation de responsabilité</Text>
        <Text style={styles.paragraph}>
          Mental Nation est un outil de développement personnel et ne remplace pas un suivi médical ou psychologique professionnel. En cas de détresse psychologique, veuillez consulter un professionnel de santé.
        </Text>
        <Text style={styles.paragraph}>
          L'application est fournie "en l'état". Nous ne garantissons pas de résultats spécifiques.
        </Text>

        <Text style={styles.sectionTitle}>7. Utilisation acceptable</Text>
        <Text style={styles.paragraph}>
          Vous vous engagez à ne pas :
        </Text>
        <Text style={styles.listItem}>• Partager votre compte avec des tiers</Text>
        <Text style={styles.listItem}>• Copier ou redistribuer les contenus</Text>
        <Text style={styles.listItem}>• Utiliser l'application à des fins illégales</Text>
        <Text style={styles.listItem}>• Tenter de contourner les mesures de sécurité</Text>

        <Text style={styles.sectionTitle}>8. Modification des conditions</Text>
        <Text style={styles.paragraph}>
          Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication dans l'application.
        </Text>

        <Text style={styles.sectionTitle}>9. Droit applicable</Text>
        <Text style={styles.paragraph}>
          Les présentes conditions sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact</Text>
        <Text style={styles.paragraph}>
          Pour toute question concernant ces conditions : contact@mentalnation.com
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
