import React, { Component } from "react";
import "./App.css";

import { Header } from "./Components/Header";
import { Body } from "./Components/Body";
import { Search } from "./Components/Search";

const headers = ["Book", "Author", "Language", "Published", "Sales"];

const data = [
  [
    "The Lord of the Rings",
    "J. R. R. Tolkien",
    "English",
    "1954–1955",
    "150 million",
  ],
  [
    "Le Petit Prince (The Little Prince)",
    "Antoine de Saint-Exupéry",
    "French",
    "1943",
    "140 million",
  ],
  [
    "Harry Potter and the Philosopher's Stone",
    "J. K. Rowling",
    "English",
    "1997",
    "107 million",
  ],
  [
    "And Then There Were None",
    "Agatha Christie",
    "English",
    "1939",
    "100 million",
  ],
  [
    "Dream of the Red Chamber",
    "Cao Xueqin",
    "Chinese",
    "1754–1791",
    "100 million",
  ],
  ["The Hobbit", "J. R. R. Tolkien", "English", "1937", "100 million"],
  [
    "She: A History of Adventure",
    "H. Rider Haggard",
    "English",
    "1887",
    "100 million",
  ],
];

class Excel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      descending: false,
      sortBy: null,
      edit: null,
      headers,
      data,
    };
  }

  sort = (e) => {
    const column = e.target.cellIndex;
    const dataToBeSorted = this.state.data;
    const descending =
      this.state.sortBy === column && this.state.descending !== true;
    dataToBeSorted.sort((a, b) => {
      return descending
        ? a[column] < b[column]
          ? 1
          : -1
        : a[column] > b[column]
        ? 1
        : -1;
    });
    this.setState({
      data: dataToBeSorted,
      sortBy: column,
      descending: descending,
    });
  };

  edit = (e) => {
    this.setState({
      edit: {
        row: parseInt(e.target.dataset.rowIdx, 10),
        cell: e.target.cellIndex,
      },
    });
  };

  saveContent = (e) => {
    e.preventDefault();
    const input = e.target.firstChild;
    const data = this.state.data;
    data[this.state.edit.row][this.state.edit.cell] = input.value;
    this.setState({
      data: data,
      edit: null,
    });
  };

  _preSearchData = null;
  toggleSearch = () => {
    if (this.state.search) {
      this.setState({
        data: this._preSearchData,
        search: false,
      });
      this._preSearchData = null;
    } else {
      this._preSearchData = this.state.data;
      this.setState({
        search: true,
      });
    }
  };

  addSearchField = () => {
    if (!this.state.search) {
      return null;
    }
    return (
      <tr>
        {this.state.headers.map((_ignore, idx) => (
          <td key={idx}>
            <input
              type="text"
              data-idx={idx}
              onChange={this.search}
              placeholder="Search item"
            />
          </td>
        ))}
      </tr>
    );
  };

  search = (e) => {
    const idx = parseInt(e.target.dataset.idx, 10);
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === "") {
      this.setState({
        data: this._preSearchData,
      });
      return;
    }

    const searchData = this._preSearchData.filter((row) =>
      row[idx].toLowerCase().includes(searchTerm)
    );

    this.setState({
      data: searchData,
    });
  };

  download = (format, e) => {
    const content =
      format === "json"
        ? JSON.stringify(this.state.data)
        : this.state.data.reduce(
            (result, row) =>
              result +
              row.reduce(
                (rowResult, cell, idx) =>
                  `${rowResult} "${cell}" ${idx < row.length - 1 ? "," : ""}`,
                ""
              ) +
              "\n",
            ""
          );
    const URL = window.URL || window.webkitURL;
    const blob = new Blob([content], { type: "text" + format });
    e.target.href = URL.createObjectURL(blob);
    e.target.download = "data." + format;
  };

  render() {
    const { headers, data, descending, sortBy, edit } = this.state;

    return (
      <div>
        <Search
          toggleBtn={this.toggleSearch}
          downloadJSON={(e) => this.download("json", e)}
          downloadCSV={(e) => this.download("csv", e)}
        />
        <table>
          <Header
            headers={headers}
            sortBy={sortBy}
            descending={descending}
            onClick={this.sort}
          />
          <Body
            onDoubleClick={this.edit}
            onSubmit={this.saveContent}
            data={data}
            edit={edit}
            addSearchField={this.addSearchField}
          />
        </table>
      </div>
    );
  }
}

export default Excel;
