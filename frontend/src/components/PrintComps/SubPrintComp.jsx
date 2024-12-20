import React from 'react';
import { Page, Text, View, Document, StyleSheet,  Font } from '@react-pdf/renderer';
Font.registerHyphenationCallback(() => []);


// Create styles similar to the previous MyDocument component
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subheader: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 9,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: 'grey',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderColor: 'grey',
  },
  tableHead: {
    flexDirection: 'row',
    fontWeight: 'bold',
    borderColor: 'grey',
    hyphenationCallback: () => [], // Prevent hyphenation
    wordWrap: 'break-word',
  },
  wide: {
    width: '30%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: 'grey',
  },
  small: {
    width: '10%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: 'grey',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    padding: 10,
    fontSize: 8,
    borderColor: 'grey',
    color: 'black',
    textAlign: 'center', // Center the text
    wordWrap: 'break-word', // Ensure no text is cut off with hyphens
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: 10,
    right: 5,
    textAlign: 'center',
  },
  timestamp: {
    position: 'absolute',
    right: 5,
    top: 5,
    fontSize: 9,
  },
});

// MyDocument Component for Subscription Table
const MyDocument = ({ data, timestamp }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Subscription Data</Text>
        <Text style={styles.subheader}>Number of Subscriptions: {data.length}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <View style={styles.wide}><Text style={styles.tableCell}>Username</Text></View>
            <View style={styles.small}><Text style={styles.tableCell}>Plan</Text></View>
            <View style={styles.small}><Text style={styles.tableCell}>Status</Text></View>
            <View style={styles.small}><Text style={styles.tableCell}>Price</Text></View>
            <View style={styles.wide}><Text style={styles.tableCell}>Duration (Days)</Text></View>
            <View style={styles.small}><Text style={styles.tableCell}>Creation Date</Text></View>
            <View style={styles.small}><Text style={styles.tableCell}>Ending Date</Text></View>
          </View>

          {data.map((sub, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              <View style={styles.wide}><Text style={styles.tableCell}>{sub.username}</Text></View>
              <View style={styles.small}><Text style={styles.tableCell}>{sub.planName}</Text></View>
              <View style={styles.small}><Text style={styles.tableCell}>{sub.subscriptionStatus}</Text></View>
              <View style={styles.small}><Text style={styles.tableCell}>{sub.price}</Text></View>
              <View style={styles.wide}><Text style={styles.tableCell}>{sub.duration}</Text></View>
              <View style={styles.small}><Text style={styles.tableCell}>{sub.creationDate}</Text></View>
              <View style={styles.small}><Text style={styles.tableCell}>{sub.endingDate}</Text></View>
            </View>
          ))}
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        <Text fixed style={styles.footer}>© 2024 Project B. All rights reserved.</Text>
      </Page>
    </Document>
  );
};

export default MyDocument;
