import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Styles for the PDF
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  header: { textAlign: 'center', fontSize: 20, marginBottom: 10, fontWeight: 'bold' },
  subheader: { textAlign: 'center', marginBottom: 20, fontSize: 10 },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
  },
  tableRow: { flexDirection: 'row' },
  tableCell: {
    flexGrow: 1,
    padding: 5,
    fontSize: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'gray',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    fontSize: 10,
  },
});

const BillingPrintComp = ({ data, timestamp }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Billing Users Report</Text>
      <Text style={styles.subheader}>Generated on: {timestamp}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>First Name</Text>
          <Text style={styles.tableCell}>Last Name</Text>
          <Text style={styles.tableCell}>Phone</Text>
          <Text style={styles.tableCell}>City</Text>
          <Text style={styles.tableCell}>Payment Method</Text>
          <Text style={styles.tableCell}>Payment Status</Text>
        </View>
        {data.map((bill, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{bill.firstName}</Text>
            <Text style={styles.tableCell}>{bill.lastName}</Text>
            <Text style={styles.tableCell}>{bill.phone}</Text>
            <Text style={styles.tableCell}>{bill.city}</Text>
            <Text style={styles.tableCell}>{bill.paymentMethod}</Text>
            <Text style={styles.tableCell}>{bill.payment}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.footer}>© 2024 Billing Report. All rights reserved.</Text>
    </Page>
  </Document>
);

export default BillingPrintComp;
