#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <math.h>
#include <errno.h>
#include <time.h>
#ifdef _WIN32
#include <direct.h>
#else
#include <sys/stat.h>
#endif

#define MAX_PRODUCTS 100
#define MAX_REVIEWS 50
#define MAX_STR_LEN 100
#define HASH_SIZE 50
#define MAX_HISTORY 50
#define MAX_CUSTOMERS 100

#define CUSTOMER_FILE "customers.txt"
#define CUSTOMER_DATA_DIR "customer_data/"

typedef struct {
    char customerID[MAX_STR_LEN];
    char review[MAX_STR_LEN];
    float rating;
    char timestamp[MAX_STR_LEN]; // Added timestamp field
} ReviewEntry;

typedef struct Product {
    char productID[MAX_STR_LEN];
    char name[MAX_STR_LEN];
    ReviewEntry reviews[MAX_REVIEWS];
    int reviewCount;
    float avgRating;
    struct Product *next;
} Product;

typedef struct {
    char customerID[MAX_STR_LEN];
    char name[MAX_STR_LEN];
} Customer;

static Product *hashTable[HASH_SIZE] = {NULL};
static Product *products[MAX_PRODUCTS];
static int productCount = 0;

static Customer customers[MAX_CUSTOMERS];
static int customerCount = 0;

static char searchHistory[MAX_HISTORY][MAX_STR_LEN];
static int searchCount = 0;

// Function to get current timestamp
static void getCurrentTime(char *buffer, size_t len) {
    time_t now = time(NULL);
    struct tm *t = localtime(&now);
    strftime(buffer, len, "%Y-%m-%d %H:%M:%S", t);
}

static unsigned int hashFunc(const char *key) {
    unsigned int hash = 0;
    while (*key) {
        hash = (hash * 31 + (unsigned char)*key) % HASH_SIZE;
        key++;
    }
    return hash;
}

static void normalizeID(char *id) {
    for (int i = 0; id[i]; i++) id[i] = toupper((unsigned char)id[i]);
}

static void readLine(char *buf, size_t len) {
    if (fgets(buf, (int)len, stdin)) buf[strcspn(buf, "\r\n")] = '\0';
    else if (len) buf[0] = '\0';
}

static void loadCustomers(void) {
    FILE *fp = fopen(CUSTOMER_FILE, "r");
    if (!fp) return;
    customerCount = 0;
    while (customerCount < MAX_CUSTOMERS) {
        char line[MAX_STR_LEN * 2];
        if (!fgets(line, sizeof line, fp)) break;
        line[strcspn(line, "\r\n")] = '\0';
        char *tok = strtok(line, "|");
        if (!tok) continue;
        strncpy(customers[customerCount].customerID, tok, MAX_STR_LEN - 1);
        customers[customerCount].customerID[MAX_STR_LEN - 1] = '\0';
        tok = strtok(NULL, "|");
        if (tok) {
            strncpy(customers[customerCount].name, tok, MAX_STR_LEN - 1);
            customers[customerCount].name[MAX_STR_LEN - 1] = '\0';
        } else customers[customerCount].name[0] = '\0';
        customerCount++;
    }
    fclose(fp);
}

static void saveCustomerToFile(Customer c) {
    FILE *fp = fopen(CUSTOMER_FILE, "a");
    if (!fp) return;
    fprintf(fp, "%s|%s\n", c.customerID, c.name);
    fclose(fp);
}

static void ensureCustomerDataDir(void) {
#ifdef _WIN32
    _mkdir(CUSTOMER_DATA_DIR);
#else
    mkdir(CUSTOMER_DATA_DIR, 0777);
#endif
}

static void saveCustomerProgress(const char *customerID, const char *productID, const char *productName, float rating, const char *review, const char *timestamp) {
    ensureCustomerDataDir();
    char filename[256];
    snprintf(filename, sizeof filename, "%s%s.txt", CUSTOMER_DATA_DIR, customerID);
    FILE *fp = fopen(filename, "a");
    if (!fp) return;
    // Save timestamp with each review
    fprintf(fp, "%s|%s|%.2f|%s|%s\n", productID, productName, rating, review, timestamp);
    fclose(fp);
}

static void loadCustomerProgress(const char *customerID) {
    char filename[256];
    snprintf(filename, sizeof filename, "%s%s.txt", CUSTOMER_DATA_DIR, customerID);
    FILE *fp = fopen(filename, "r");
    if (!fp) return;
    char line[512];
    while (fgets(line, sizeof line, fp)) {
        line[strcspn(line, "\r\n")] = '\0';
        char *pid = strtok(line, "|");
        char *pname = strtok(NULL, "|");
        char *rstr = strtok(NULL, "|");
        char *rev = strtok(NULL, "|");
        char *timeStr = strtok(NULL, "|");
        if (pid && pname && rstr && rev && timeStr)
            printf("Product: %s (%s) | Rating: %s | Review: %s | Time: %s\n", pname, pid, rstr, rev, timeStr);
    }
    fclose(fp);
}

static Product *findProduct(const char *productID) {
    unsigned int idx = hashFunc(productID);
    Product *p = hashTable[idx];
    while (p) {
        if (strcmp(p->productID, productID) == 0) return p;
        p = p->next;
    }
    return NULL;
}

static void insertProduct(Product *p) {
    unsigned int idx = hashFunc(p->productID);
    p->next = hashTable[idx];
    hashTable[idx] = p;
}

static Customer *findCustomer(const char *customerID) {
    for (int i = 0; i < customerCount; i++)
        if (strcmp(customers[i].customerID, customerID) == 0)
            return &customers[i];
    return NULL;
}

static void addCustomer(void) {
    if (customerCount >= MAX_CUSTOMERS) {
        printf("Customer limit reached!\n");
        return;
    }
    char id[MAX_STR_LEN];
    char name[MAX_STR_LEN];
    printf("New Customer ID: ");
    if (scanf("%99s", id) != 1) return;
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF);
    normalizeID(id);
    if (findCustomer(id)) {
        printf("Customer ID already exists!\n");
        return;
    }
    printf("Enter Customer Name: ");
    readLine(name, sizeof name);
    strncpy(customers[customerCount].customerID, id, MAX_STR_LEN - 1);
    strncpy(customers[customerCount].name, name, MAX_STR_LEN - 1);
    saveCustomerToFile(customers[customerCount]);
    customerCount++;
    printf("Customer added successfully!\n");
}

static void addProductReviewInternal(const char *productID_in, const char *name_in, const char *customerID_in, float rating, const char *review, int skipSave) {
    if (rating < 1.0f || rating > 5.0f) {
        printf("Invalid rating! Must be between 1.0 and 5.0.\n");
        return;
    }

    char productID[MAX_STR_LEN], customerID[MAX_STR_LEN], name[MAX_STR_LEN];
    strncpy(productID, productID_in, MAX_STR_LEN - 1);
    strncpy(customerID, customerID_in, MAX_STR_LEN - 1);
    strncpy(name, name_in, MAX_STR_LEN - 1);
    normalizeID(productID);
    normalizeID(customerID);

    Customer *c = findCustomer(customerID);
    if (!c) return;

    Product *p = findProduct(productID);
    char timestamp[MAX_STR_LEN];
    getCurrentTime(timestamp, sizeof(timestamp));

    if (p) {
        for (int i = 0; i < p->reviewCount; i++)
            if (strcmp(p->reviews[i].customerID, customerID) == 0)
                return;
        if (p->reviewCount >= MAX_REVIEWS) return;
        ReviewEntry *r = &p->reviews[p->reviewCount++];
        strcpy(r->customerID, customerID);
        strcpy(r->review, review);
        r->rating = rating;
        strcpy(r->timestamp, timestamp);
        float sum = 0;
        for (int i = 0; i < p->reviewCount; i++) sum += p->reviews[i].rating;
        p->avgRating = sum / p->reviewCount;
    } else {
        if (productCount >= MAX_PRODUCTS) return;
        Product *newP = malloc(sizeof(Product));
        strcpy(newP->productID, productID);
        strcpy(newP->name, name);
        newP->reviewCount = 1;
        strcpy(newP->reviews[0].customerID, customerID);
        strcpy(newP->reviews[0].review, review);
        newP->reviews[0].rating = rating;
        strcpy(newP->reviews[0].timestamp, timestamp);
        newP->avgRating = rating;
        newP->next = NULL;
        products[productCount++] = newP;
        insertProduct(newP);
        p = newP;
    }

    if (!skipSave)
        saveCustomerProgress(customerID, p->productID, p->name, rating, review, timestamp);
}

static void loadAllCustomerReviews(void) {
    ensureCustomerDataDir();
    for (int i = 0; i < customerCount; i++) {
        char filename[256];
        snprintf(filename, sizeof filename, "%s%s.txt", CUSTOMER_DATA_DIR, customers[i].customerID);
        FILE *fp = fopen(filename, "r");
        if (!fp) continue;
        char line[512];
        while (fgets(line, sizeof line, fp)) {
            line[strcspn(line, "\r\n")] = '\0';
            char *pid = strtok(line, "|");
            char *pname = strtok(NULL, "|");
            char *rstr = strtok(NULL, "|");
            char *rev = strtok(NULL, "|");
            char *timeStr = strtok(NULL, "|");
            if (pid && pname && rstr && rev && timeStr) {
                float rating = strtof(rstr, NULL);
                addProductReviewInternal(pid, pname, customers[i].customerID, rating, rev, 1);
                // store timeStr also if needed for display
            }
        }
        fclose(fp);
    }
}

static void searchProduct(void) {
    char id[MAX_STR_LEN];
    printf("Enter Product ID to search: ");
    if (scanf("%99s", id) != 1) return;
    normalizeID(id);
    Product *p = findProduct(id);
    if (p) {
        printf("\nProduct Found:\n");
        printf("ID: %s | Name: %s | Avg Rating: %.2f\n", p->productID, p->name, p->avgRating);
        for (int i = 0; i < p->reviewCount; i++)
            printf(" Customer: %s | %.2f - %s | Time: %s\n", 
                   p->reviews[i].customerID, p->reviews[i].rating, p->reviews[i].review, p->reviews[i].timestamp);
        if (searchCount < MAX_HISTORY) strcpy(searchHistory[searchCount++], id);
    } else printf("Product not found!\n");
}

static void displayTopRated(void) {
    int n;
    printf("Enter how many top-rated products to display: ");
    if (scanf("%d", &n) != 1) return;
    if (n <= 0 || n > productCount) {
        printf("Invalid number! Please enter a number between 1 and %d.\n", productCount);
        return;
    }
    for (int i = 0; i < productCount - 1; i++)
        for (int j = 0; j < productCount - i - 1; j++)
            if (products[j]->avgRating < products[j + 1]->avgRating) {
                Product *t = products[j];
                products[j] = products[j + 1];
                products[j + 1] = t;
            }
    printf("\n--- Top %d Rated Products ---\n", n);
    for (int i = 0; i < n; i++)
        printf("%d. ID: %s | Name: %s | Avg Rating: %.2f\n", i + 1, products[i]->productID, products[i]->name, products[i]->avgRating);
}

int main(void) {
    int choice;
    char pid[MAX_STR_LEN], name[MAX_STR_LEN], review[MAX_STR_LEN], customerID[MAX_STR_LEN];
    float rating;

    loadCustomers();
    loadAllCustomerReviews();

    for (;;) {
        printf("\n--- Login Required ---\n");
        printf("Enter Customer ID (or type NEW to register): ");
        if (scanf("%99s", customerID) != 1) break;
        int ch;
        while ((ch = getchar()) != '\n' && ch != EOF);
        normalizeID(customerID);
        if (strcmp(customerID, "NEW") == 0) {
            addCustomer();
            continue;
        }
        Customer *loggedIn = findCustomer(customerID);
        if (!loggedIn) {
            printf("Customer not found! Please add as new customer.\n");
            continue;
        }
        printf("\nWelcome, %s (ID: %s)\n", loggedIn->name, loggedIn->customerID);
        loadCustomerProgress(loggedIn->customerID);
        for (;;) {
            printf("\n--- Product Rating & Review System ---\n");
            printf("1. Add Rating & Review\n2. Search Product\n3. Display Top Rated\n4. Logout\nChoice: ");
            if (scanf("%d", &choice) != 1) break;
            int ch2;
            while ((ch2 = getchar()) != '\n' && ch2 != EOF);
            switch (choice) {
                case 1:
                    printf("Enter Product ID: ");
                    if (scanf("%99s", pid) != 1) break;
                    while ((ch2 = getchar()) != '\n' && ch2 != EOF);
                    normalizeID(pid);
                    {
                        Product *existingProduct = findProduct(pid);
                        if (existingProduct) {
                            printf("Product found: %s\n", existingProduct->name);
                            strcpy(name, existingProduct->name);
                        } else {
                            printf("Enter Product Name: ");
                            readLine(name, sizeof name);
                        }
                    }
                    printf("Enter Rating (1.0-5.0): ");
                    if (scanf("%f", &rating) != 1) break;
                    while ((ch2 = getchar()) != '\n' && ch2 != EOF);
                    printf("Do you want to add a review? (Y/N): ");
                    int yn = getchar();
                    while (yn == '\n') yn = getchar();
                    if (yn == 'N' || yn == 'n')
                        strcpy(review, "No review provided.");
                    else {
                        while ((ch2 = getchar()) != '\n' && ch2 != EOF);
                        printf("Enter Review: ");
                        readLine(review, sizeof review);
                    }
                    addProductReviewInternal(pid, name, loggedIn->customerID, rating, review, 0);
                    break;
                case 2:
                    searchProduct();
                    break;
                case 3:
                    displayTopRated();
                    break;
                case 4:
                    printf("Logged out\n");
                    goto logout;
                default:
                    printf("Invalid choice.\n");
            }
        }
        logout:;
    }

    for (int i = 0; i < productCount; i++) free(products[i]);
    return 0;
}
