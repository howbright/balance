import './App.css';
import React from 'react';
import NumberFormat from 'react-number-format';

function App() {
  return (
    <div className="App container">
      <DetailItemsBox items={ITEMS} />
    </div>
  );
}

class DepositWithdrawalTable extends React.Component {
  render() {
    return (
        <table className='styled-table'>
          <DepositWithdrawalHeader />
          <DepositWithdrawalRow items={this.props.items} />
        </table>
      );
  }
}

class DepositWithdrawalHeader extends React.Component {
  render() {
    return (
      <thead>
        <tr>
          <th>date</th>
          <th>category</th>
          <th>amount</th>
        </tr>
      </thead>)
  }
}

class DepositWithdrawalRow extends React.Component {
  render() {
    const items = this.props.items;
    let rows = []
    items.forEach((item, index) => {
      item.amount < 0 ? 
      rows.push(<tr key={index}>
        <td><span style={{color: 'red'}}>{item.date}</span></td>
        <td>
          <div className='container'>
              <span style={{color: 'red'}}>{item.category}</span>
              <span style={{color: 'greay', fontSize:7}}>{item.detail}</span>
          </div>
        </td>
        <td>
          <NumberFormat
             className="align-right" style={{color: 'red', textAlign: 'right'}}
            value={item.amount}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'₩'}
            renderText={formattedValue => <span style={{color:'red'}}>{formattedValue}</span>} // <--- Don't forget this!
          /></td>
    </tr>) :
         rows.push(<tr key={index}>
          <td><span style={{color: 'blue'}}>{item.date}</span></td>
          <td><span style={{color: 'blue'}}>{item.category}</span></td>
          <td>
          <NumberFormat
             className="align-right" style={{color: 'blue', textAlign: 'right'}}
            value={item.amount}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'₩'}
            renderText={formattedValue => <span style={{color:'blue'}}>{formattedValue}</span>} // <--- Don't forget this!
          /></td>
        </tr>)
    });
    return <tbody>{rows}</tbody>;
  }
}

class SearchBar extends React.Component {
constructor(props) {
  super(props);
  this.handleFilterTextChange = this.handleFilterTextChange.bind(this)
}

handleFilterTextChange(e) {
  this.props.onFilterTextChange(e.target.value);
}

  render () {
    return (
      <div>
        <p>헌금사용현황</p>
        <div>
        <button onClick={this.props.onClickPlusButton}>+</button>
        <button onClick={this.props.onClickMinusButton}>-</button>
        <button onClick={this.props.onClickTotalButton}>total</button>
        <input onChange={this.handleFilterTextChange} type="text" placeholder="Search..." />
        </div>
      </div>
    );
  }
}

class DetailItemsBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      filterMode: 'total'
    };
    this.onClickPlusButton = this.onClickPlusButton.bind(this);
    this.onClickMinusButton = this.onClickMinusButton.bind(this);
    this.onClickTotalButton = this.onClickTotalButton.bind(this);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }

  onClickPlusButton = () => {
     this.setState({filterMode: 'plus'})
  }
  onClickMinusButton = () => {
    this.setState({filterMode: 'minus'})
  }
  onClickTotalButton = () => {
    this.setState({filterMode: 'total'})
  }

  render () {
    const items = this.props.items;
    let filteredItems = [];
    if (this.state.filterMode === 'plus') {
      filteredItems = items.filter((item)=> item.amount > 0);
    } else if (this.state.filterMode === 'minus') {
      filteredItems = items.filter((item)=> item.amount < 0);
    } else {
      filteredItems = items
    }

    if (this.state.filterText.length > 0) {
      filteredItems = filteredItems.filter((item) => { 
        let result = item.amount > 0 ? item.category.indexOf(this.state.filterText) > -1
        : item.category.indexOf(this.state.filterText) > -1 || item.detail.indexOf(this.state.filterText) > -1 
        return result;
      })
    }
    
    let result = 0;
    filteredItems.forEach((item) => {
        result = result + item.amount;
    })
    return (
      <div className='box'>
        <SearchBar onClickPlusButton={this.onClickPlusButton} 
                   onClickMinusButton={this.onClickMinusButton}  
                   onClickTotalButton={this.onClickTotalButton}
                   onFilterTextChange={this.handleFilterTextChange}
        />
        <DepositWithdrawalTable items={filteredItems} />
        <TableDataCalculationResult result={result} />
      </div>
      );
    }
}

class TableDataCalculationResult extends React.Component {
  render() {
    return (
      <NumberFormat
      className="align-right" style={{color: 'blue', textAlign: 'right'}}
     value={this.props.result}
     displayType={'text'}
     thousandSeparator={true}
     prefix={'₩'}
     renderText={formattedValue => <p> balance: {formattedValue}</p>}// <--- Don't forget this!
   />
    );
  }
}
// FinancialDashboard : 전체
//    CurrentStatusBox : 현재지표 박스
//    DetailItemsBox : 세부항목 박스 
//        SearchBar : 검색바
//        DepositWithdrawalTable : 입출금테이블 ---
//              DepositWithdrawalHeader: 테이블헤더 ---
//              DepositWithdrawalRow: 행 ---
//       TableDataCalculationResultBox : 결과 박스
//              StartDateFinancialInclusionSwich: 시작일 재정 포함 여부 
//              TableDataCalculationResult: 테이블 결과
const ITEMS = [
  {date: '2021/10/07', category: '온라인 말씀 사역', detail: 'Zoom유료결제(16.49$)', amount: -20000, unit: '$'},
  {date: '2021/10/8', category: '헌금', detail: '박찬희대표님', amount: 100000, unit: '₩'},
  {date: '2021/11/07', category: '온라인 말씀 사역', detail: 'Zoom유료결제(16.49$)', amount: -20000, unit: '$'},
  {date: '2021/11/10', category: '헌금', detail: '박찬희대표님', amount: 100000, unit: '₩'},
  {date: '2021/12/07', category: '온라인 말씀 사역', detail: 'Zoom유료결제(16.49$)', amount: -20000, unit: '$'},
  {date: '2021/12/16', category: '헌금', detail: '박찬희대표님', amount: 100000, unit: '₩'},
]

export default App;
