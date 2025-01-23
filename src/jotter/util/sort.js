/* eslint-disable indent */
'use strict';

const { Sequelize } = require('sequelize');

/**
 * Sets up the notes/folders sort
 * @param {String} value - Index of sort option
 * @returns {Object[]} - sort order
 */
const sort = (value) => {
  let serializedSort;
  switch (value) {
    case '1':
      serializedSort = [['createdAt', 'DESC']];
      break;
    case '2':
      serializedSort = [['createdAt', 'ASC']];
      break;
    case '3':
      serializedSort = [
        [
          Sequelize.literal('REGEXP_REPLACE(title, "[0-9]+", "")'),
          'ASC',
        ],
        [
          Sequelize.literal('CAST(REGEXP_SUBSTR(title, "[0-9]+") AS UNSIGNED)'),
          'ASC',
        ],
        [
          Sequelize.literal(`
            CAST(
              REGEXP_SUBSTR(
                SUBSTRING(
                  title,
                  LOCATE(REGEXP_SUBSTR(title, "[0-9]+"), title) + LENGTH(REGEXP_SUBSTR(title, "[0-9]+"))
                ),
                "[0-9]+"
              ) AS UNSIGNED
            )
          `),
          'ASC',
        ],
      ];
      break;
    case '4':
      serializedSort = [
        [
          Sequelize.literal('REGEXP_REPLACE(title, "[0-9]+", "")'),
          'DESC',
        ],
        [
          Sequelize.literal('CAST(REGEXP_SUBSTR(title, "[0-9]+") AS UNSIGNED)'),
          'DESC',
        ],
        [
          Sequelize.literal(`
            CAST(
              REGEXP_SUBSTR(
                SUBSTRING(
                  title,
                  LOCATE(REGEXP_SUBSTR(title, "[0-9]+"), title) + LENGTH(REGEXP_SUBSTR(title, "[0-9]+"))
                ),
                "[0-9]+"
              ) AS UNSIGNED
            )
          `),
          'DESC',
        ],
      ];
      break;
    case '5':
      serializedSort = [['updatedAt', 'DESC']];
      break;
    case '6':
      serializedSort = [['updateAt', 'ASC']];
      break;
  }
  return serializedSort;
};

module.exports = sort;
