import React, {useState} from 'react';
import {FlatList, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {PieChart} from 'react-native-chart-kit';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';

// Get the screen width to dynamically size the chart
const screenWidth = Dimensions.get("window").width;

// Styled components for layout and design
const Container = styled(SafeAreaView)`
    flex: 1;
    background: #eef3f7;
`;

const ContentWrapper = styled.ScrollView`
    flex: 1;
    padding: 24px;
`;

const ChartWrapper = styled.View`
    width: 100%;
    align-items: center;
`;

const ChartContainer = styled.View`
    display: flex;
    min-width: 100%;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;

const LegendContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 8px;
    justify-content: center;
`;

// Component for a single legend item (color box + text)
const LegendItem = styled.View`
    flex-direction: row;
    align-items: center;
    margin-right: 16px;
    margin-bottom: 8px;
`;

const LegendColorBox = styled.View`
    width: 12px;
    height: 12px;
    background-color: ${props => props.color};
    margin-right: 6px;
    border-radius: 2px;
`;

const LegendText = styled.Text`
    font-size: 14px;
    color: #333;
`;

const HeaderTitle = styled.Text`
    font-size: 26px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
    font-size: 22px;
    font-weight: bold;
    color: #0071ff;
    margin-top: 16px;
    margin-bottom: 12px;
`;

const SummaryCard = styled.View`
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 3;
`;

const SummaryText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #444;
    margin-bottom: 4px;
`;

const ExpenseCard = styled(SummaryCard)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-left-width: 4px;
    border-left-color: #0071ff;
`;

const ExpenseInfo = styled.View`
    flex: 1;
`;

const ExpenseTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

const ExpenseDetail = styled.Text`
    font-size: 14px;
    color: #666;
    margin-top: 4px;
`;

const EmptyText = styled(ExpenseDetail)`
    text-align: center;
    margin-top: 20px;
`;

// Horizontal scroll for filter buttons
const FilterScroll = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: {paddingHorizontal: 24},
})`
    margin-bottom: 16px;
    margin-left: -24px;
    margin-right: -24px;
`;

// Similar scroll for category buttons
const CategoryScroll = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: {paddingHorizontal: 24},
})`
    margin-bottom: 16px;
    margin-left: -24px;
    margin-right: -24px;
`;

const FilterButton = styled.TouchableOpacity`
    padding: 8px 16px;
    background: ${props => (props.selected ? "#0071ff" : "white")};
    border-radius: 20px;
    border: 1px solid #0071ff;
    margin-right: 8px;
`;

const FilterButtonText = styled.Text`
    color: ${props => (props.selected ? "white" : "#0071ff")};
    font-size: 16px;
    font-weight: bold;
`;

const CategoryButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    background: ${props => (props.selected ? "#0071ff" : "white")};
    border: 1px solid #0071ff;
    border-radius: 20px;
    margin-right: 8px;
`;

const CategoryText = styled.Text`
    margin-left: 6px;
    font-size: 16px;
    color: ${props => (props.selected ? "white" : "#0071ff")};
    font-weight: bold;
`;

export default function ExpensesPage() {
    // Getting expenses from redux store
    const expenses = useSelector((state) => state.expenses.expenses);

    // Local state for selected timeframe and category
    const [selectedTimeframe, setSelectedTimeframe] = useState("This Month");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Timeframe filter options
    const timeframeOptions = ["Today", "This Week", "This Month", "This Year", "All"];

    // Default categories with icons from Ionicons
    const defaultCategories = [
        {name: "All", icon: "albums-outline"},
        {name: "Food", icon: "fast-food-outline"},
        {name: "Transport", icon: "bus-outline"},
        {name: "Bills", icon: "receipt-outline"},
        {name: "Entertainment", icon: "videocam-outline"},
        {name: "Shopping", icon: "cart-outline"},
        {name: "Other", icon: "ellipsis-horizontal-outline"},
    ];

    // Function to filter expenses by timeframe (e.g., today, this month)
    const filterByTimeframe = (expense) => {
        if (selectedTimeframe === "All") return true;
        const expenseDate = new Date(expense.date);
        const now = new Date();
        if (selectedTimeframe === "Today") {
            return expenseDate.toDateString() === now.toDateString();
        }
        if (selectedTimeframe === "This Week") {
            // Calculate the start of the current week (Monday)
            const currentDay = now.getDay() || 7;
            const monday = new Date(now);
            monday.setDate(now.getDate() - currentDay + 1);
            monday.setHours(0, 0, 0, 0);
            return expenseDate >= monday;
        }
        if (selectedTimeframe === "This Month") {
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            return (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear);
        }
        if (selectedTimeframe === "This Year") {
            return expenseDate.getFullYear() === now.getFullYear();
        }
        return true;
    };

    // Filter expenses based on selected timeframe and category
    const filteredExpensesByTime = expenses.filter(exp => exp.date && filterByTimeframe(exp));
    const filteredExpenses = selectedCategory === "All"
        ? filteredExpensesByTime
        : filteredExpensesByTime.filter(exp => exp.category === selectedCategory);

    // Calculate total expenses by currency
    const totalByCurrency = filteredExpenses.reduce((acc, exp) => {
        const currency = exp.currency || "UAH";
        acc[currency] = (acc[currency] || 0) + parseFloat(exp.amount);
        return acc;
    }, {});

    // Calculate total expenses by category and currency
    const totalByCategory = filteredExpenses.reduce((acc, exp) => {
        const category = exp.category || "Other";
        const currency = exp.currency || "UAH";
        const key = `${currency} - ${category}`;
        acc[key] = (acc[key] || 0) + parseFloat(exp.amount);
        return acc;
    }, {});

    // Define pie chart colors
    const chartColors = ['#d1ecff', '#80cbff', '#a6daff', 'rgba(90,189,255,0.75)', '#8338ec', '#ff9f1c', '#118ab2'];

    // Prepare data for the pie chart
    const pieChartData = Object.entries(totalByCategory).map(([name, amount], index) => ({
        name,
        population: amount,
        color: chartColors[index % chartColors.length],
        legendFontColor: "#333",
        legendFontSize: 14,
    }));

    // Render individual expense items in the list
    const renderExpense = ({item}) => (
        <ExpenseCard activeOpacity={0.8}>
            <ExpenseInfo>
                <ExpenseTitle>{item.title}</ExpenseTitle>
                <ExpenseDetail>
                    Amount: {item.amount} {item.currency}
                </ExpenseDetail>
                <ExpenseDetail>Category: {item.category}</ExpenseDetail>
                <ExpenseDetail>Date: {item.date}</ExpenseDetail>
            </ExpenseInfo>
        </ExpenseCard>
    );

    return (
        <Container>
            <ContentWrapper>
                <HeaderTitle>Expense Analysis</HeaderTitle>

                {/* Timeframe filter */}
                <SectionTitle>Select Timeframe</SectionTitle>
                <FilterScroll>
                    {timeframeOptions.map(item => (
                        <FilterButton
                            key={item}
                            selected={selectedTimeframe === item}
                            onPress={() => setSelectedTimeframe(item)}
                        >
                            <FilterButtonText selected={selectedTimeframe === item}>
                                {item}
                            </FilterButtonText>
                        </FilterButton>
                    ))}
                </FilterScroll>

                {/* Category filter */}
                <SectionTitle>Select Category</SectionTitle>
                <CategoryScroll>
                    {defaultCategories.map(({name, icon}) => (
                        <CategoryButton
                            key={name}
                            selected={selectedCategory === name}
                            onPress={() => setSelectedCategory(name)}
                        >
                            <Ionicons
                                name={icon}
                                size={20}
                                color={selectedCategory === name ? "white" : "#0071ff"}
                            />
                            <CategoryText selected={selectedCategory === name}>
                                {name}
                            </CategoryText>
                        </CategoryButton>
                    ))}
                </CategoryScroll>

                {/* Total expenses by currency */}
                {Object.entries(totalByCurrency).filter(([currency, total]) => total > 0).length > 0 && (
                    <SummaryCard>
                        {Object.entries(totalByCurrency).map(([currency, total]) =>
                            total > 0 ? (
                                <SummaryText key={currency}>
                                    Total ({currency}): {total.toFixed(2)} {currency}
                                </SummaryText>
                            ) : null
                        )}
                    </SummaryCard>
                )}

                {/* Pie chart for expenses by category */}
                <SectionTitle>Expenses by Category</SectionTitle>
                {pieChartData.length > 0 ? (
                    <SummaryCard>
                        <ChartWrapper>
                            <PieChart
                                data={pieChartData}
                                width={screenWidth}
                                height={200}
                                chartConfig={{
                                    backgroundColor: "#fff",
                                    backgroundGradientFrom: "#fff",
                                    backgroundGradientTo: "#fff",
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: () => "#333",
                                }}
                                accessor="population"
                                backgroundColor="transparent"
                                paddingLeft={screenWidth/4}
                                hasLegend={false}
                            />
                        </ChartWrapper>
                        <LegendContainer>
                            {pieChartData.map(item => (
                                <LegendItem key={item.name}>
                                    <LegendColorBox color={item.color}/>
                                    <LegendText>{item.population.toFixed(2)} {item.name}</LegendText>
                                </LegendItem>
                            ))}
                        </LegendContainer>
                    </SummaryCard>
                ) : (
                    <EmptyText>No data for this category yet.</EmptyText>
                )}

                {/* List of filtered expenses */}
                <SectionTitle>Filtered Expenses</SectionTitle>
                {filteredExpenses.length === 0 ? (
                    <EmptyText>No expenses recorded for the selected filters.</EmptyText>
                ) : (
                    <FlatList
                        data={filteredExpenses}
                        keyExtractor={(item) => item.id}
                        renderItem={renderExpense}
                        scrollEnabled={false}
                    />
                )}
            </ContentWrapper>
        </Container>
    );
}
