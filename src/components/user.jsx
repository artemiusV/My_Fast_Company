import React, { useState } from "react";
import api from "../api";
import { declOfNum } from "../utils";

const dataUsers = api.users
  .fetchAll()
  .reduce(
    (calc, dataUser) => Object.assign(calc, { [dataUser._id]: dataUser }),
    {}
  );

const Users = () => {
  const [storeUsers, setStoreUsers] = useState(dataUsers);
  const [countUsers, setCountUsers] = useState(Object.keys(storeUsers).length);

  const _buttonDeleteUser = (userID) => {
    setStoreUsers((store) => {
      delete store[userID];
      setCountUsers(Object.keys(store).length);
      return store;
    });
  };

  const _rowRender = (user) => {
    const qualitiesRendered = (dataQualityUser) => {
      if (Array.isArray(dataQualityUser) && dataQualityUser.length === 0) {
        return;
      }
      return dataQualityUser.map((quality) => {
        const color = `m-2 badge bg-${quality.color}`;
        return (
          <span key={quality._id} className={color}>
            {quality.name}
          </span>
        );
      });
    };
    return (
      <tr key={user._id}>
        <td>{user.name}</td>
        <td>{qualitiesRendered(user.qualities)} </td>
        <td>{user?.profession?.name ? user.profession.name : ""}</td>
        <td>{user.completedMeetings}</td>
        <td>{`${user.rate} / 5`}</td>
        <td>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => _buttonDeleteUser(user._id)}
          >
            Удалить
          </button>
        </td>
      </tr>
    );
  };

  const _headerTable = (count) => {
    if (count) {
      const msg = `${count} ${declOfNum(count, [
        "человек",
        "человекап",
        "человек",
      ])} тусанут с тобой сегодня.`;
      return (
        <h2>
          <span className="badge bg-primary m-2">{msg}</span>
        </h2>
      );
    }
    return (
      <h2>
        <span className="badge bg-danger m-2">Никто с тобой не тусанет</span>
      </h2>
    );
  };

  const _renderTable = (count) => {
    if (count < 1) {
      return;
    }
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Имя</th>
            <th scope="col">Качества</th>
            <th scope="col">Профессия</th>
            <th scope="col">Встретился, раз</th>
            <th scope="col">Оценка</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {Object.values(storeUsers).map((dataUser) => _rowRender(dataUser))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      {_headerTable(countUsers)}
      {_renderTable(countUsers)}
    </>
  );
};

export default Users;
