import { Document, Font, Image, Page, PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ITourCheckoutState } from "src/types/booking";
import { fCurrencyVN } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";

Font.register({
    family: 'Roboto',
    fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
    useMemo(
        () =>
            StyleSheet.create({
                // layout
                page: {
                    fontSize: 9,
                    lineHeight: 1.6,
                    fontFamily: 'Roboto',
                    backgroundColor: '#FFFFFF',
                    padding: '40px 24px 120px 24px',
                },
                footer: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: 24,
                    margin: 'auto',
                    borderTopWidth: 1,
                    borderStyle: 'solid',
                    position: 'absolute',
                    borderColor: '#e9ecef',
                },
                container: { flexDirection: 'row', justifyContent: 'space-between' },
                // margin
                mb4: { marginBottom: 4 },
                mb8: { marginBottom: 8 },
                mb40: { marginBottom: 40 },
                // text
                h3: { fontSize: 16, fontWeight: 700, lineHeight: 1.2 },
                h4: { fontSize: 12, fontWeight: 700 },
                text1: { fontSize: 10 },
                text2: { fontSize: 9 },
                text1Bold: { fontSize: 10, fontWeight: 700 },
                text2Bold: { fontSize: 9, fontWeight: 700 },
                // table
                table: { display: 'flex', width: '100%' },
                row: {
                    padding: '10px 0 8px 0',
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderStyle: 'solid',
                    borderColor: '#e9ecef',
                },
                cell_1: { width: '25%' },
                cell_2: { width: '20%' },
                cell_3: { width: '15%' },
                cell_4: { width: '20%' },
                cell_5: { width: '20%' },
                noBorder: { paddingTop: '10px', paddingBottom: 0, borderBottomWidth: 0 },
            }),
        []
    );


export function CheckoutInvoicePDFViewer({ checkoutState }: { checkoutState: ITourCheckoutState }) {
    return (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <CheckOutInvoicePdfDocument invoice={checkoutState} />
        </PDFViewer>
    );
}

type PdfDocumentProps = {
    invoice?: ITourCheckoutState;
};

function CheckOutInvoicePdfDocument({ invoice }: PdfDocumentProps) {
    const today = new Date();

    const {
        contactInfo,
        paymentMethod,
        items,
        total
    } = invoice ?? {};

    const styles = useStyles();

    const renderHeader = () => (
        <View style={[styles.container, styles.mb40]}>
            <Image source="/logo/logo-single.png" style={{ width: 48, height: 48 }} />

            <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: 5 }}>
                <Text style={styles.text2}>Mã tour:</Text> <Text style={[styles.text2Bold]}>{items ? items[0].tourCode : ""}</Text>
            </View>
        </View>
    );

    const renderFooter = () => (
        <View style={[styles.container, styles.footer]} fixed>
            <View style={{ width: '75%' }}>
                <Text style={[styles.text2Bold, styles.mb4]}>Ghi chú</Text>
                <Text style={[styles.text2]}>
                    Cảm ơn bạn đã đặt tour du lịch tại CanThoTravel
                </Text>
            </View>
            <View style={{ width: '25%', textAlign: 'right' }}>
                <Text style={[styles.text2]}>canthotravel@gmail.com</Text>
            </View>
        </View>
    );

    const renderBillingInfo = () => (
        <View style={[styles.container, styles.mb40]}>
            <View style={{ width: '50%' }}>
                <Text style={[styles.text1Bold, styles.mb4]}>Hóa đơn từ</Text>
                <Text style={[styles.text2]}>CTY TNHH Du lịch CanThoTravel</Text>
                <Text style={[styles.text2]}>35 Trần Hưng Đạo, Quận Ninh Kiều, Cần Thơ</Text>
                <Text style={[styles.text2]}>02923888899</Text>
            </View>

            <View style={{ width: '50%' }}>
                <Text style={[styles.text1Bold, styles.mb4]}>Hóa đơn đến</Text>
                <Text style={[styles.text2]}>Khách hàng {contactInfo?.fullName}</Text>
                <Text style={[styles.text2]}>{contactInfo?.email}</Text>
                <Text style={[styles.text2]}>{contactInfo?.phone}</Text>
            </View>
        </View>
    );

    const renderDates = () => (
        <View style={[styles.container, styles.mb40]}>
            <View style={{ width: '50%' }}>
                <Text style={[styles.text1Bold, styles.mb4]}>Ngày lập</Text>
                <Text style={[styles.text2]}>{fDate(today)}</Text>
            </View>
        </View>
    );

    const renderTable = () => (
        <>
            <Text style={[styles.text1Bold]}>Chi tiết tour</Text>

            <View style={styles.table}>
                <View>
                    <View style={styles.row}>
                        <View style={styles.cell_1}>
                            <Text style={[styles.text2Bold]}>Tên tour của quý khách</Text>
                        </View>
                        <View style={styles.cell_2}>
                            <Text style={[styles.text2Bold]}>
                                Thời gian khởi hành
                            </Text>
                        </View>
                        <View style={styles.cell_3}>
                            <Text style={[styles.text2Bold, { textAlign: 'right' }]}>SL khách tham gia</Text>
                        </View>
                        <View style={[styles.cell_4, { textAlign: 'right' }]}>
                            <Text style={[styles.text2Bold]}>Giá tiền</Text>
                        </View>
                        <View style={[styles.cell_5, { textAlign: 'right' }]}>
                            <Text style={[styles.text2Bold]}>Thành tiền</Text>
                        </View>
                    </View>
                </View>

                <View>
                    {items?.map((item, index) => (
                        <View key={item.id} style={styles.row}>
                            <View style={styles.cell_1}>
                                <Text style={[styles.text2Bold]}>{item.title}</Text>
                                <Text style={[styles.text2]}>{item.locations.flatMap((l) => `${l.name} `)}</Text>
                            </View>
                            <View style={styles.cell_2}>
                                <Text style={[styles.text2Bold]}>{fDate(item.date)}</Text>
                                <Text style={[styles.text2]}>{item.duration}</Text>
                            </View>
                            <View style={styles.cell_3}>
                                <Text style={[styles.text2, { textAlign: 'right' }]}>{item.quantity} người</Text>
                            </View>
                            <View style={[styles.cell_4, { textAlign: 'right' }]}>
                                <Text style={[styles.text2]}>{fCurrencyVN(item.price)}</Text>
                            </View>
                            <View style={[styles.cell_5, { textAlign: 'right' }]}>
                                <Text style={[styles.text2]}>{fCurrencyVN(item.price * item.quantity)}</Text>
                            </View>
                        </View>
                    ))}

                    {[
                        { name: 'Tổng cộng', value: total, styles: styles.h4 },
                    ].map((item) => (
                        <View key={item.name} style={[styles.row, styles.noBorder]}>
                            <View style={styles.cell_1} />
                            <View style={styles.cell_2} />
                            <View style={styles.cell_3} />
                            <View style={styles.cell_4}>
                                <Text style={[item.styles ?? styles.text2]}>{item.name}</Text>
                            </View>
                            <View style={[styles.cell_5, { textAlign: 'right' }]}>
                                <Text style={[item.styles ?? styles.text2]}>{fCurrencyVN(item.value)}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </>
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {renderHeader()}
                {renderBillingInfo()}
                {renderDates()}
                {renderTable()}
                {renderFooter()}
            </Page>
        </Document>
    );
}